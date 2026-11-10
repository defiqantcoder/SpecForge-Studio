import { describe, it, expect, vi, beforeEach } from 'vitest';

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
    safeStorage: {
      isEncryptionAvailable: vi.fn().mockReturnValue(false)
    },
    shell: {
      openExternal: vi.fn()
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
  fchmodSync: vi.fn(),
  renameSync: vi.fn(),
  readFileSync: vi.fn(),
  chmodSync: vi.fn(),
  readdirSync: vi.fn(),
  unlinkSync: vi.fn()
}));

// Mock os
vi.mock('os', () => ({
  homedir: vi.fn().mockReturnValue('/mock/home'),
  type: vi.fn().mockReturnValue('MockOS'),
  release: vi.fn().mockReturnValue('1.0.0')
}));

process.env.VITE_DEV_SERVER_URL = 'http://localhost:5173';
process.env.NODE_ENV = 'development';

import '../../electron/main';
import { resolveSafeChildPath } from '../../electron/pathSecurity';
import { ipcMain } from 'electron';
import * as fs from 'fs';

describe('Electron Main Security', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

      const malformedPayloadResult = await handler(mockEvent, { files: "not an array" });
      expect(malformedPayloadResult).toEqual({ canceled: true, error: 'No artifact files provided' });
    });
  });

  describe('settings:setGeminiKey handler', () => {
    beforeEach(() => {
      vi.mocked(fs.openSync).mockReset().mockReturnValue(42);
      vi.mocked(fs.writeFileSync).mockReset();
      vi.mocked(fs.fchmodSync).mockReset();
      vi.mocked(fs.closeSync).mockReset();
      vi.mocked(fs.renameSync).mockReset();
    });

    const saveKey = () => (ipcMain as any)._getHandlers().get('settings:setGeminiKey')(mockEvent, 'synthetic-key');

    it('creates a private file exclusively before writing and atomically replacing settings', () => {
      saveKey();
      const tempPath = vi.mocked(fs.openSync).mock.calls[0][0];
      expect(tempPath).toMatch(/^\/mock\/app\/path\/settings\.json\.tmp-/);
      expect(fs.openSync).toHaveBeenCalledWith(tempPath, 'wx', 0o600);
      expect(fs.writeFileSync).toHaveBeenCalledWith(42, JSON.stringify({ geminiKeyPlain: 'synthetic-key' }, null, 2), { encoding: 'utf8' });
      expect(fs.fchmodSync).toHaveBeenCalledWith(42, 0o600);
      expect(fs.closeSync).toHaveBeenCalledWith(42);
      expect(fs.renameSync).toHaveBeenCalledWith(tempPath, '/mock/app/path/settings.json');
      expect(vi.mocked(fs.closeSync).mock.invocationCallOrder[0]).toBeLessThan(vi.mocked(fs.renameSync).mock.invocationCallOrder[0]);
      expect(fs.unlinkSync).not.toHaveBeenCalled();
    });

    it('retries a collision with a new name and leaves the colliding file alone', () => {
      vi.mocked(fs.openSync).mockImplementationOnce(() => { throw Object.assign(new Error('collision'), { code: 'EEXIST' }); });
      saveKey();
      const calls = vi.mocked(fs.openSync).mock.calls;
      expect(calls).toHaveLength(2);
      expect(calls[0][0]).not.toBe(calls[1][0]);
      expect(fs.renameSync).toHaveBeenCalledWith(calls[1][0], '/mock/app/path/settings.json');
      expect(fs.unlinkSync).not.toHaveBeenCalled();
    });

    it.each(['EEXIST', 'EACCES'])('never cleans up a file when exclusive creation fails with %s', (code) => {
      const error = Object.assign(new Error('open failed'), { code });
      vi.mocked(fs.openSync).mockImplementation(() => { throw error; });
      expect(saveKey).toThrow(error);
      expect(fs.openSync).toHaveBeenCalledTimes(code === 'EEXIST' ? 10 : 1);
      expect(fs.writeFileSync).not.toHaveBeenCalled();
      expect(fs.unlinkSync).not.toHaveBeenCalled();
    });

    it.each(['writeFileSync', 'fchmodSync', 'closeSync', 'renameSync'] as const)('cleans up only its own file after %s fails', (operation) => {
      const error = new Error('operation failed');
      vi.mocked(fs[operation]).mockImplementationOnce(() => { throw error; });
      expect(saveKey).toThrow(error);
      expect(fs.unlinkSync).toHaveBeenCalledExactlyOnceWith(vi.mocked(fs.openSync).mock.calls[0][0]);
      expect(fs.closeSync).toHaveBeenCalledWith(42);
      if (operation !== 'renameSync') expect(fs.renameSync).not.toHaveBeenCalled();
    });

    it('should handle malformed payloads safely', async () => {
      const handlers = (ipcMain as any)._getHandlers();
      const handler = handlers.get('settings:setGeminiKey');
      expect(handler).toBeDefined();

      await expect(() => handler(mockEvent, null)).toThrow('API key must be a string');
      await expect(() => handler(mockEvent, 123)).toThrow('API key must be a string');
      await expect(() => handler(mockEvent, {})).toThrow('API key must be a string');
    });
  });
});
