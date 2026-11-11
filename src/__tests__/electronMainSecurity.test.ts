import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('electron', () => {
  const ipcHandlers = new Map<string, Function>();
  class BrowserWindow {
    webContents = {
      setWindowOpenHandler: vi.fn(),
      on: vi.fn()
    };
    on = vi.fn();
    loadFile = vi.fn();
    loadURL = vi.fn();

    constructor() {}
    static getAllWindows() {
      return [];
    }
  }

  return {
    app: {
      isPackaged: true,
      getPath: vi.fn().mockReturnValue('/mock/app/path'),
      getName: vi.fn().mockReturnValue('MockApp'),
      setName: vi.fn(),
      whenReady: vi.fn().mockResolvedValue(undefined),
      on: vi.fn(),
      getAppPath: vi.fn().mockReturnValue('/mock/app')
    },
    ipcMain: {
      handle: vi.fn((channel: string, handler: Function) => {
        ipcHandlers.set(channel, handler);
      }),
      _getHandlers: () => ipcHandlers
    },
    dialog: {
      showSaveDialog: vi.fn(),
      showOpenDialog: vi.fn()
    },
    BrowserWindow,
    shell: {
      openExternal: vi.fn()
    },
    safeStorage: {
      isEncryptionAvailable: vi.fn().mockReturnValue(true),
      encryptString: vi.fn((text: string) => Buffer.from(`enc:${text}`, 'utf8')),
      decryptString: vi.fn((buf: Buffer) => {
        const s = buf.toString('utf8');
        return s.startsWith('enc:') ? s.slice(4) : s;
      })
    }
  };
});

// Mock fs
vi.mock('fs', () => ({
  existsSync: vi.fn(),
  mkdirSync: vi.fn(),
  writeFileSync: vi.fn(),
  openSync: vi.fn(),
  closeSync: vi.fn(),
  renameSync: vi.fn(),
  readFileSync: vi.fn(),
  chmodSync: vi.fn(),
  readdirSync: vi.fn(),
  unlinkSync: vi.fn(),
  realpathSync: vi.fn((p: string) => p),
  lstatSync: vi.fn(),
  readlinkSync: vi.fn()
}));

// Mock os
vi.mock('os', () => ({
  homedir: vi.fn().mockReturnValue('/mock/home'),
  type: vi.fn().mockReturnValue('MockOS'),
  release: vi.fn().mockReturnValue('1.0.0')
}));

process.env.VITE_DEV_SERVER_URL = 'http://localhost:5173';
process.env.NODE_ENV = 'development';

import * as fs from 'fs';
import * as path from 'path';
import '../../electron/main';
import { resolveSafeChildPath } from '../../electron/pathSecurity';
import { app, ipcMain, safeStorage } from 'electron';

describe('Electron Main Security', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (safeStorage.isEncryptionAvailable as any).mockReturnValue(true);
  });

  const mockEvent = {
    senderFrame: {
      url: require('url').pathToFileURL(require('path').resolve(__dirname, '../../dist/index.html')).href
    }
  };

  describe('resolveSafeChildPath guards', () => {
    it('should reject relative paths containing .. traversal', () => {
      expect(() => resolveSafeChildPath('/mock/root', '../outside.txt')).toThrow('Path traversal rejected');
      expect(() => resolveSafeChildPath('/mock/root', 'folder/../../outside.txt')).toThrow('Path traversal rejected');
    });

    it('should reject absolute paths', () => {
      expect(() => resolveSafeChildPath('/mock/root', '/absolute/path.txt')).toThrow('Absolute paths are not permitted');
    });

    it('should reject null bytes', () => {
      expect(() => resolveSafeChildPath('/mock/root', 'file\0.txt')).toThrow('Invalid relative path: null byte');
    });

    it('should resolve safe relative paths', () => {
      const result = resolveSafeChildPath('/mock/root', 'safe/file.txt');
      expect(result).toBe('/mock/root/safe/file.txt');
    });
  });

  describe('dialog:exportWorkspace handler', () => {
    it('should handle empty or malformed payloads safely', async () => {
      const handlers = (ipcMain as any)._getHandlers();
      const handler = handlers.get('dialog:exportWorkspace');
      expect(handler).toBeDefined();

      const emptyFilesResult = await handler(mockEvent, { files: [] });
      expect(emptyFilesResult).toEqual({ canceled: true, error: 'No artifact files provided' });

      const nullPayloadResult = await handler(mockEvent, null);
      expect(nullPayloadResult).toEqual({ canceled: true, error: 'No artifact files provided' });

      const malformedPayloadResult = await handler(mockEvent, { files: 'not an array' });
      expect(malformedPayloadResult).toEqual({ canceled: true, error: 'No artifact files provided' });
    });
  });

  describe('settings atomic file writes', () => {
    let realFs: typeof import('fs');
    let realOs: typeof import('os');
    let directory: string;
    let settingsPath: string;
    const save = (key: string) => (ipcMain as any)._getHandlers().get('settings:setGeminiKey')(mockEvent, key);

    beforeEach(async () => {
      realFs = await vi.importActual<typeof import('fs')>('fs');
      realOs = await vi.importActual<typeof import('os')>('os');
      directory = realFs.mkdtempSync(path.join(realOs.tmpdir(), 'specforge-settings-'));
      settingsPath = path.join(directory, 'settings.json');
      vi.mocked(app.getPath).mockReturnValue(directory);
      (safeStorage.isEncryptionAvailable as any).mockReturnValue(true);
      (safeStorage.encryptString as any).mockImplementation((text: string) => Buffer.from(`enc:${text}`, 'utf8'));
      for (const name of [
        'existsSync',
        'mkdirSync',
        'openSync',
        'closeSync',
        'writeFileSync',
        'renameSync',
        'unlinkSync'
      ] as const) {
        vi.mocked(fs[name]).mockImplementation(realFs[name] as any);
      }
    });

    afterEach(() => {
      vi.mocked(app.getPath).mockReturnValue('/mock/app/path');
      realFs.rmSync(directory, { recursive: true, force: true });
    });

    it('uses distinct temporary paths even when the clock is fixed and stores encrypted key only', () => {
      const clock = vi.spyOn(Date, 'now').mockReturnValue(1234);
      try {
        save('first-key');
        save('second-key');
        const paths = vi.mocked(fs.openSync).mock.calls.map(([file]) => file);
        expect(new Set(paths).size).toBe(2);
        expect(fs.openSync).toHaveBeenCalledWith(expect.any(String), 'wx', 0o600);
        const written = JSON.parse(realFs.readFileSync(settingsPath, 'utf8'));
        expect(written).toEqual({
          geminiKeyEncrypted: Buffer.from('enc:second-key', 'utf8').toString('base64')
        });
        expect(written.geminiKeyPlain).toBeUndefined();
      } finally {
        clock.mockRestore();
      }
    });

    it('preserves an existing temporary file when exclusive creation fails', () => {
      let collisionPath = '';
      vi.mocked(fs.openSync).mockImplementationOnce((file, flags, mode) => {
        collisionPath = String(file);
        realFs.writeFileSync(file, 'other writer');
        return realFs.openSync(file, flags, mode);
      });
      realFs.writeFileSync(settingsPath, 'original settings');
      expect(() => save('new-key')).toThrow();
      expect(realFs.readFileSync(collisionPath, 'utf8')).toBe('other writer');
      expect(realFs.readFileSync(settingsPath, 'utf8')).toBe('original settings');
      expect(fs.unlinkSync).not.toHaveBeenCalled();
    });

    it.each(['writeFileSync', 'renameSync'] as const)(
      'cleans up its own file after %s fails',
      (operation) => {
        realFs.writeFileSync(settingsPath, 'original settings');
        vi.mocked(fs[operation]).mockImplementationOnce(() => {
          throw new Error('injected failure');
        });
        expect(() => save('new-key')).toThrow('injected failure');
        expect(realFs.readFileSync(settingsPath, 'utf8')).toBe('original settings');
        expect(realFs.readdirSync(directory)).toEqual(['settings.json']);
        expect(fs.closeSync).toHaveBeenCalledTimes(1);
        expect(fs.unlinkSync).toHaveBeenCalledTimes(1);
      }
    );

    if (process.platform !== 'win32') {
      it('clears settings with private permissions before atomic replacement under a permissive umask', () => {
        realFs.writeFileSync(settingsPath, 'original settings', { mode: 0o644 });
        const previousUmask = process.umask(0);
        vi.mocked(fs.renameSync).mockImplementationOnce((source, destination) => {
          expect(realFs.statSync(source).mode & 0o777).toBe(0o600);
          expect(realFs.readFileSync(settingsPath, 'utf8')).toBe('original settings');
          realFs.renameSync(source, destination);
        });
        try {
          save('');
          expect(realFs.readFileSync(settingsPath, 'utf8')).toBe('{}');
          expect(realFs.statSync(settingsPath).mode & 0o777).toBe(0o600);
        } finally {
          process.umask(previousUmask);
        }
      });
    }
  });

  describe('settings:setGeminiKey and settings:getGeminiKey handlers', () => {
    it('should handle malformed payloads safely', async () => {
      const handlers = (ipcMain as any)._getHandlers();
      const handler = handlers.get('settings:setGeminiKey');
      expect(handler).toBeDefined();

      await expect(() => handler(mockEvent, null)).toThrow('API key must be a string');
      await expect(() => handler(mockEvent, 123)).toThrow('API key must be a string');
      await expect(() => handler(mockEvent, {})).toThrow('API key must be a string');
    });

    it('refuses unencrypted plaintext disk persistence when safeStorage encryption is unavailable and keeps key in memory only', async () => {
      const prevEnvKey = process.env.GEMINI_API_KEY;
      delete process.env.GEMINI_API_KEY;
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      try {
        const handlers = (ipcMain as any)._getHandlers();
        const setHandler = handlers.get('settings:setGeminiKey');
        const getHandler = handlers.get('settings:getGeminiKey');

        (safeStorage.isEncryptionAvailable as any).mockReturnValue(false);
        (fs.existsSync as any).mockReturnValue(false);

        const result = await setHandler(mockEvent, 'AIzaSySecretKey1234');
        expect(result.hasKey).toBe(true);
        expect(result.source).toBe('memory');
        expect(result.maskedKey).toBe('AIza••••1234');
        expect(result.warning).toMatch(/OS keychain encryption is unavailable/i);

        // Must NOT write any plaintext API key to settings.json
        expect(fs.openSync).not.toHaveBeenCalled();
        expect(fs.writeFileSync).not.toHaveBeenCalled();
        expect(warnSpy).toHaveBeenCalled();

        // Reading key within the same process returns the in-memory session key
        const current = await getHandler(mockEvent);
        expect(current).toEqual({
          hasKey: true,
          source: 'memory',
          maskedKey: 'AIza••••1234'
        });

        // Clearing resets in-memory key cleanly
        const cleared = await setHandler(mockEvent, '');
        expect(cleared).toEqual({
          hasKey: false,
          source: 'none',
          maskedKey: undefined
        });
      } finally {
        if (prevEnvKey !== undefined) {
          process.env.GEMINI_API_KEY = prevEnvKey;
        }
        warnSpy.mockRestore();
      }
    });
  });
});
