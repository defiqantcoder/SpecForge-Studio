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
