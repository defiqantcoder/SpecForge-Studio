import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fsMock from 'fs';

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
      isEncryptionAvailable: vi.fn().mockReturnValue(false)
    }
  };
});

// Mock fs
vi.mock('fs', () => ({
  existsSync: vi.fn(),
  mkdirSync: vi.fn(),
  writeFileSync: vi.fn(),
  readFileSync: vi.fn(),
  chmodSync: vi.fn(),
  renameSync: vi.fn(),
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
    it('should write API key securely via atomic rename and explicit chmod', async () => {
      const handlers = (ipcMain as any)._getHandlers();
      const handler = handlers.get('settings:setGeminiKey');
      expect(handler).toBeDefined();

      const apiKey = 'test-api-key';
      handler(mockEvent, apiKey);

      expect(vi.mocked(fsMock.writeFileSync)).toHaveBeenCalledWith(
        expect.stringMatching(/\.tmp$/),
        expect.any(String),
        expect.objectContaining({ mode: 0o600 })
      );

      expect(vi.mocked(fsMock.chmodSync)).toHaveBeenCalledWith(
        expect.stringMatching(/\.tmp$/),
        0o600
      );

      expect(vi.mocked(fsMock.renameSync)).toHaveBeenCalledWith(
        expect.stringMatching(/\.tmp$/),
        expect.not.stringMatching(/\.tmp$/)
      );

      expect(vi.mocked(fsMock.chmodSync)).toHaveBeenCalledWith(
        expect.not.stringMatching(/\.tmp$/),
        0o600
      );
    });

    it.each(['test-api-key', ''])('cleans up failed writes for key %j', (apiKey) => {
      const handler = (ipcMain as any)._getHandlers().get('settings:setGeminiKey');
      const settingsPath = '/mock/app/path/settings.json';
      vi.mocked(fsMock.existsSync).mockReturnValue(true);

      for (const step of ['write', 'temp chmod', 'rename', 'settings chmod']) {
        for (const cleanupFails of [false, true]) {
          vi.mocked(fsMock.writeFileSync).mockReset();
          vi.mocked(fsMock.chmodSync).mockReset();
          vi.mocked(fsMock.renameSync).mockReset();
          vi.mocked(fsMock.unlinkSync).mockReset();
          const originalError = new Error(`${step} failed`);
          const fail = () => { throw originalError; };
          if (step === 'write') vi.mocked(fsMock.writeFileSync).mockImplementationOnce(fail);
          if (step === 'rename') vi.mocked(fsMock.renameSync).mockImplementationOnce(fail);
          if (step === 'temp chmod') vi.mocked(fsMock.chmodSync).mockImplementationOnce(fail);
          if (step === 'settings chmod') {
            vi.mocked(fsMock.chmodSync).mockImplementationOnce(() => undefined).mockImplementationOnce(fail);
          }
          if (cleanupFails) {
            vi.mocked(fsMock.unlinkSync).mockImplementationOnce(() => { throw new Error('cleanup failed'); });
          }

          expect(() => handler(mockEvent, apiKey)).toThrow(originalError);
          expect(fsMock.unlinkSync).toHaveBeenCalledExactlyOnceWith(`${settingsPath}.tmp`);
          if (step === 'write' || step === 'temp chmod') {
            expect(fsMock.renameSync).not.toHaveBeenCalled();
          }
        }
      }
      vi.mocked(fsMock.existsSync).mockReset();
    });

    it('clears existing settings through the atomic write path', () => {
      const handler = (ipcMain as any)._getHandlers().get('settings:setGeminiKey');
      vi.mocked(fsMock.existsSync).mockReturnValueOnce(true);
      handler(mockEvent, '   ');
      expect(fsMock.writeFileSync).toHaveBeenCalledWith(
        '/mock/app/path/settings.json.tmp', '{}', { encoding: 'utf8', mode: 0o600 }
      );
      expect(fsMock.renameSync).toHaveBeenCalledWith(
        '/mock/app/path/settings.json.tmp', '/mock/app/path/settings.json'
      );
      expect(fsMock.chmodSync).toHaveBeenCalledWith('/mock/app/path/settings.json', 0o600);
      expect(fsMock.unlinkSync).not.toHaveBeenCalled();
    });

    it('does not create settings when clearing an absent key', () => {
      const handler = (ipcMain as any)._getHandlers().get('settings:setGeminiKey');
      vi.mocked(fsMock.existsSync).mockReturnValueOnce(false);
      handler(mockEvent, '');
      expect(fsMock.writeFileSync).not.toHaveBeenCalled();
      expect(fsMock.renameSync).not.toHaveBeenCalled();
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
