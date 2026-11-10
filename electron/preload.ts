import { contextBridge, ipcRenderer } from 'electron';
import type {
  DesktopAPI,
  ExportWorkspaceRequest,
  GeminiStructuredRequest,
  SavedBlueprint
} from './types';

const desktopAPI: DesktopAPI = {
  isDesktop: true,
  getAppInfo: () => ipcRenderer.invoke('app:getInfo'),
  copyToClipboard: (text: string) => ipcRenderer.invoke('clipboard:writeText', text),
  saveFileDialog: (suggestedFilename: string, content: string) =>
    ipcRenderer.invoke('dialog:saveFile', { suggestedFilename, content }),
  exportWorkspaceDialog: (req: ExportWorkspaceRequest) =>
    ipcRenderer.invoke('dialog:exportWorkspace', req),
  listBlueprints: () => ipcRenderer.invoke('blueprints:list'),
  saveBlueprint: (blueprint: Omit<SavedBlueprint, 'id' | 'updatedAt'> & { id?: string }) =>
    ipcRenderer.invoke('blueprints:save', blueprint),
  deleteBlueprint: (id: string) => ipcRenderer.invoke('blueprints:delete', id),
  exportBlueprintFile: (blueprint: SavedBlueprint) =>
    ipcRenderer.invoke('blueprints:exportFile', blueprint),
  importBlueprintFile: () => ipcRenderer.invoke('blueprints:importFile'),
  getGeminiSettings: () => ipcRenderer.invoke('settings:getGeminiKey'),
  setGeminiApiKey: (apiKey: string) => ipcRenderer.invoke('settings:setGeminiKey', apiKey),
  generateGeminiStructured: (req: GeminiStructuredRequest) =>
    ipcRenderer.invoke('ai:generateStructured', req),
  openExternalUrl: (url: string) => ipcRenderer.invoke('shell:openExternal', url)
};

contextBridge.exposeInMainWorld('desktopAPI', desktopAPI);
