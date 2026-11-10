import { app, BrowserWindow, clipboard, dialog, ipcMain, safeStorage, shell } from 'electron';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import type {
  DesktopAppInfo,
  ExportWorkspaceRequest,
  GeminiSettingsInfo,
  GeminiStructuredRequest,
  SavedBlueprint
} from './types';
import { resolveSafeChildPath, sanitizeBlueprintId } from './pathSecurity';

/**
 * Ubuntu 24.04 AppArmor restricts unprivileged user namespaces by default
 * (kernel.apparmor_restrict_unprivileged_userns=1). When running unpackaged,
 * via AppImage, or without root-owned setuid chrome-sandbox, Chromium's OS
 * namespace sandbox cannot initialize. Keep renderer isolation strict
 * (contextIsolation, nodeIntegration: false) while checking SUID sandbox availability.
 */
function configureLinuxSandbox(): void {
  if (process.platform !== 'linux') return;

  try {
    const usernsPath = '/proc/sys/kernel/apparmor_restrict_unprivileged_userns';
    const restricted = fs.existsSync(usernsPath)
      ? fs.readFileSync(usernsPath, 'utf8').trim() === '1'
      : false;

    if (!restricted && !process.env.APPIMAGE) {
      return;
    }

    const sandboxBinary = path.join(path.dirname(process.execPath), 'chrome-sandbox');
    let hasValidSetuidSandbox = false;
    if (fs.existsSync(sandboxBinary)) {
      const stat = fs.statSync(sandboxBinary);
      const isRootOwned = stat.uid === 0;
      const isSetuid = (stat.mode & 0o4000) !== 0;
      hasValidSetuidSandbox = isRootOwned && isSetuid;
    }

    if (!hasValidSetuidSandbox || Boolean(process.env.APPIMAGE)) {
      app.commandLine.appendSwitch('no-sandbox');
    }
  } catch {
    app.commandLine.appendSwitch('no-sandbox');
  }
}

configureLinuxSandbox();

const isDev = !app.isPackaged && Boolean(process.env.VITE_DEV_SERVER_URL || process.argv.includes('--dev') || process.env.npm_lifecycle_event === 'electron:dev');

function getBlueprintsDir(): string {
  const dir = path.join(app.getPath('userData'), 'blueprints');
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function getSettingsPath(): string {
  return path.join(app.getPath('userData'), 'settings.json');
}

interface StoredSettings {
  geminiKeyEncrypted?: string;
  geminiKeyPlain?: string;
}

function readStoredGeminiKey(): { key: string; source: 'stored' | 'env' | 'none' } {
  try {
    const settingsPath = getSettingsPath();
    if (fs.existsSync(settingsPath)) {
      const raw = JSON.parse(fs.readFileSync(settingsPath, 'utf8')) as StoredSettings;
      if (raw.geminiKeyEncrypted && safeStorage.isEncryptionAvailable()) {
        const decrypted = safeStorage.decryptString(Buffer.from(raw.geminiKeyEncrypted, 'base64'));
        if (decrypted.trim()) return { key: decrypted.trim(), source: 'stored' };
      }
      if (raw.geminiKeyPlain && raw.geminiKeyPlain.trim()) {
        return { key: raw.geminiKeyPlain.trim(), source: 'stored' };
      }
    }
  } catch (err) {
    console.warn('Failed to read stored Gemini key:', err);
  }

  const envKey = process.env.GEMINI_API_KEY?.trim() || '';
  if (envKey) {
    return { key: envKey, source: 'env' };
  }

  return { key: '', source: 'none' };
}

function maskKey(key: string): string {
  if (!key) return '';
  if (key.length <= 8) return '••••••••';
  return `${key.slice(0, 4)}••••${key.slice(-4)}`;
}

function writeStoredGeminiKey(apiKey: string): GeminiSettingsInfo {
  const trimmed = apiKey.trim();
  const settingsPath = getSettingsPath();
  fs.mkdirSync(path.dirname(settingsPath), { recursive: true });

  if (!trimmed) {
    if (fs.existsSync(settingsPath)) {
      fs.writeFileSync(settingsPath, JSON.stringify({}, null, 2), 'utf8');
    }
    const envFallback = process.env.GEMINI_API_KEY?.trim() || '';
    return {
      hasKey: Boolean(envFallback),
      source: envFallback ? 'env' : 'none',
      maskedKey: envFallback ? maskKey(envFallback) : undefined
    };
  }

  const payload: StoredSettings = {};
  if (safeStorage.isEncryptionAvailable()) {
    payload.geminiKeyEncrypted = safeStorage.encryptString(trimmed).toString('base64');
  } else {
    payload.geminiKeyPlain = trimmed;
  }

  fs.writeFileSync(settingsPath, JSON.stringify(payload, null, 2), { encoding: 'utf8', mode: 0o600 });
  return {
    hasKey: true,
    source: 'stored',
    maskedKey: maskKey(trimmed)
  };
}

let mainWindow: BrowserWindow | null = null;

function resolveAppIcon(): string | undefined {
  const candidates = [
    path.join(__dirname, '../build/icons/512x512.png'),
    path.join(__dirname, '../build/icon.png'),
    path.join(process.resourcesPath || '', 'icons/512x512.png')
  ];
  return candidates.find((p) => p && fs.existsSync(p));
}

function createWindow(): void {
  const iconPath = resolveAppIcon();

  mainWindow = new BrowserWindow({
    width: 1460,
    height: 920,
    minWidth: 960,
    minHeight: 680,
    title: 'SpecForge Studio',
    backgroundColor: '#020617',
    icon: iconPath,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:') {
        void shell.openExternal(url);
      }
    } catch {
      // Invalid URL
    }
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, targetUrl) => {
    try {
      const parsedUrl = new URL(targetUrl);
      if (isDev) {
        const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
        const allowedOrigin = new URL(devUrl).origin;
        if (parsedUrl.origin !== allowedOrigin) {
          event.preventDefault();
        }
      } else {
        if (parsedUrl.protocol !== 'file:') {
          event.preventDefault();
        }
      }
    } catch {
      event.preventDefault();
    }
  });

  if (isDev) {
    const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
    void mainWindow.loadURL(devUrl);
  } else {
    void mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function registerIpcHandlers(): void {
  ipcMain.handle('app:getInfo', (): DesktopAppInfo => {
    return {
      name: app.getName(),
      version: app.getVersion(),
      platform: process.platform,
      arch: process.arch,
      osRelease: `${os.type()} ${os.release()}`,
      userDataDir: app.getPath('userData'),
      blueprintsDir: getBlueprintsDir()
    };
  });

  ipcMain.handle('clipboard:writeText', (_event, text: string): boolean => {
    if (typeof text !== 'string') return false;
    clipboard.writeText(text);
    return true;
  });

  ipcMain.handle(
    'dialog:saveFile',
    async (_event, args: { suggestedFilename: string; content: string }) => {
      if (!args || typeof args.content !== 'string' || (args.suggestedFilename !== undefined && typeof args.suggestedFilename !== 'string')) {
        return { canceled: true, error: 'Invalid file payload' };
      }
      const cleanName = path.basename(args.suggestedFilename || 'artifact.md');
      const result = await dialog.showSaveDialog(mainWindow ?? undefined!, {
        title: 'Save SpecForge Artifact',
        defaultPath: path.join(os.homedir(), cleanName),
        filters: [
          { name: 'Markdown / Config / Script', extensions: ['md', 'txt', 'yml', 'yaml', 'sh', 'json'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (result.canceled || !result.filePath) {
        return { canceled: true };
      }

      fs.writeFileSync(result.filePath, args.content, 'utf8');
      if (result.filePath.endsWith('.sh')) {
        fs.chmodSync(result.filePath, 0o755);
      }
      return { canceled: false, filePath: result.filePath };
    }
  );

  ipcMain.handle('dialog:exportWorkspace', async (_event, req: ExportWorkspaceRequest) => {
    if (!req || !Array.isArray(req.files) || req.files.length === 0) {
      return { canceled: true, error: 'No artifact files provided' };
    }

    const result = await dialog.showOpenDialog(mainWindow ?? undefined!, {
      title: 'Choose Project Repository Folder to Export SpecForge Files',
      defaultPath: os.homedir(),
      properties: ['openDirectory', 'createDirectory']
    });

    if (result.canceled || result.filePaths.length === 0) {
      return { canceled: true };
    }

    const targetDir = path.resolve(result.filePaths[0]);
    const writtenFiles: string[] = [];

    for (const file of req.files) {
      if (typeof file.relativePath !== 'string' || typeof file.content !== 'string') {
        throw new Error('Malformed file entry in export request');
      }
      const resolvedFile = resolveSafeChildPath(targetDir, file.relativePath);
      fs.mkdirSync(path.dirname(resolvedFile), { recursive: true });
      fs.writeFileSync(resolvedFile, file.content, 'utf8');
      if (resolvedFile.endsWith('.sh')) {
        fs.chmodSync(resolvedFile, 0o755);
      }
      writtenFiles.push(file.relativePath);
    }

    return {
      canceled: false,
      targetDir,
      writtenCount: writtenFiles.length,
      writtenFiles
    };
  });

  ipcMain.handle('blueprints:list', (): SavedBlueprint[] => {
    const dir = getBlueprintsDir();
    const entries = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
    const items: SavedBlueprint[] = [];

    for (const entry of entries) {
      try {
        const fullPath = resolveSafeChildPath(dir, entry);
        const parsed = JSON.parse(fs.readFileSync(fullPath, 'utf8')) as SavedBlueprint;
        if (parsed && parsed.title && parsed.formState) {
          items.push(parsed);
        }
      } catch (err) {
        console.warn(`Skipping unreadable blueprint ${entry}:`, err);
      }
    }

    items.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    return items;
  });

  ipcMain.handle(
    'blueprints:save',
    (_event, input: Omit<SavedBlueprint, 'id' | 'updatedAt'> & { id?: string }): SavedBlueprint => {
      if (!input || typeof input.formState !== 'string' || (input.title !== undefined && typeof input.title !== 'string') || (input.id !== undefined && typeof input.id !== 'string') || (input.syncCode !== undefined && typeof input.syncCode !== 'string')) {
        throw new Error('Invalid blueprint payload');
      }
      const dir = getBlueprintsDir();
      const id = sanitizeBlueprintId(input.id || input.title || 'blueprint');
      const record: SavedBlueprint = {
        id,
        title: input.title?.trim() || 'Untitled Blueprint',
        syncCode: input.syncCode ? input.syncCode.trim().toLowerCase() : '',
        updatedAt: Date.now(),
        formState: input.formState
      };

      const filePath = resolveSafeChildPath(dir, `${id}.json`);
      fs.writeFileSync(filePath, JSON.stringify(record, null, 2), 'utf8');
      return record;
    }
  );

  ipcMain.handle('blueprints:delete', (_event, id: string): boolean => {
    if (typeof id !== 'string') throw new Error('Invalid id');
    const dir = getBlueprintsDir();
    const safeId = sanitizeBlueprintId(id);
    const filePath = resolveSafeChildPath(dir, `${safeId}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  });

  ipcMain.handle('blueprints:exportFile', async (_event, blueprint: SavedBlueprint) => {
    if (!blueprint || typeof blueprint !== 'object' || (blueprint.title !== undefined && typeof blueprint.title !== 'string')) {
      return { canceled: true, error: 'Invalid blueprint payload' };
    }
    const safeSlug = sanitizeBlueprintId(blueprint.title || 'specforge-blueprint');
    const result = await dialog.showSaveDialog(mainWindow ?? undefined!, {
      title: 'Export SpecForge Blueprint (.specforge.json)',
      defaultPath: path.join(os.homedir(), `${safeSlug}.specforge.json`),
      filters: [{ name: 'SpecForge Blueprint', extensions: ['json'] }]
    });

    if (result.canceled || !result.filePath) {
      return { canceled: true };
    }

    fs.writeFileSync(result.filePath, JSON.stringify(blueprint, null, 2), 'utf8');
    return { canceled: false, filePath: result.filePath };
  });

  ipcMain.handle('blueprints:importFile', async () => {
    const result = await dialog.showOpenDialog(mainWindow ?? undefined!, {
      title: 'Import SpecForge Blueprint (.json)',
      defaultPath: os.homedir(),
      properties: ['openFile'],
      filters: [{ name: 'SpecForge Blueprint', extensions: ['json'] }]
    });

    if (result.canceled || result.filePaths.length === 0) {
      return { canceled: true };
    }

    try {
      const raw = JSON.parse(fs.readFileSync(result.filePaths[0], 'utf8')) as SavedBlueprint;
      if (!raw || typeof raw.formState !== 'string') {
        return { canceled: false, error: 'File is not a valid SpecForge blueprint JSON.' };
      }
      return { canceled: false, blueprint: raw };
    } catch (err) {
      return { canceled: false, error: err instanceof Error ? err.message : 'Failed to parse JSON' };
    }
  });

  ipcMain.handle('settings:getGeminiKey', (): GeminiSettingsInfo => {
    const { key, source } = readStoredGeminiKey();
    return {
      hasKey: Boolean(key),
      source,
      maskedKey: key ? maskKey(key) : undefined
    };
  });

  ipcMain.handle('settings:setGeminiKey', (_event, apiKey: string): GeminiSettingsInfo => {
    if (typeof apiKey !== 'string') {
      throw new Error('API key must be a string');
    }
    return writeStoredGeminiKey(apiKey);
  });

  ipcMain.handle('ai:generateStructured', async (_event, req: GeminiStructuredRequest) => {
    if (!req || typeof req.userQuery !== 'string' || typeof req.systemPrompt !== 'string' || !req.responseSchema || typeof req.responseSchema !== 'object') {
      throw new Error('Invalid request payload');
    }
    const { key } = readStoredGeminiKey();
    if (!key) {
      throw new Error(
        'No Gemini API key configured. Click "AI Settings" in the top bar to add your Gemini API key, or set GEMINI_API_KEY.'
      );
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(key)}`;
    const payload = {
      contents: [{ role: 'user', parts: [{ text: req.userQuery }] }],
      systemInstruction: { parts: [{ text: req.systemPrompt }] },
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: req.responseSchema
      }
    };

    const delays = [1000, 2000, 4000];
    for (let attempt = 0; attempt <= delays.length; attempt++) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          const errBody = await response.text().catch(() => '');
          throw new Error(`HTTP ${response.status}${errBody ? `: ${errBody.slice(0, 180)}` : ''}`);
        }
        const result = (await response.json()) as {
          candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
        };
        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error('Empty model response');
        return JSON.parse(text);
      } catch (err) {
        if (attempt === delays.length) throw err;
        await new Promise((r) => setTimeout(r, delays[attempt]));
      }
    }
  });

  ipcMain.handle('shell:openExternal', async (_event, url: string): Promise<boolean> => {
    if (typeof url !== 'string') return false;
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:') {
        await shell.openExternal(url);
        return true;
      }
    } catch {
      // Invalid URL
    }
    return false;
  });
}

app.whenReady().then(() => {
  app.setName('SpecForge Studio');
  registerIpcHandlers();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
