export interface SavedBlueprint {
  id: string;
  title: string;
  tag?: string;
  updatedAt: number;
  formState: string;
}

export interface ExportWorkspaceRequest {
  files: Array<{
    relativePath: string;
    content: string;
  }>;
}

export interface ExportWorkspaceResult {
  canceled: boolean;
  targetDir?: string;
  writtenCount?: number;
  writtenFiles?: string[];
  error?: string;
}

export interface SaveFileResult {
  canceled: boolean;
  filePath?: string;
  error?: string;
}

export interface ImportBlueprintResult {
  canceled: boolean;
  blueprint?: SavedBlueprint;
  error?: string;
}

export interface DesktopAppInfo {
  name: string;
  version: string;
  platform: string;
  arch: string;
  osRelease: string;
  userDataDir: string;
  blueprintsDir: string;
}

export interface GeminiSettingsInfo {
  hasKey: boolean;
  source: 'stored' | 'env' | 'memory' | 'none';
  maskedKey?: string;
  warning?: string;
}

export interface GeminiStructuredRequest {
  systemPrompt: string;
  userQuery: string;
  responseSchema: Record<string, unknown>;
}

export interface DesktopAPI {
  isDesktop: true;
  getAppInfo: () => Promise<DesktopAppInfo>;
  copyToClipboard: (text: string) => Promise<boolean>;
  saveFileDialog: (suggestedFilename: string, content: string) => Promise<SaveFileResult>;
  exportWorkspaceDialog: (req: ExportWorkspaceRequest) => Promise<ExportWorkspaceResult>;
  listBlueprints: () => Promise<SavedBlueprint[]>;
  saveBlueprint: (
    blueprint: Omit<SavedBlueprint, 'id' | 'updatedAt'> & { id?: string }
  ) => Promise<SavedBlueprint>;
  deleteBlueprint: (id: string) => Promise<boolean>;
  exportBlueprintFile: (blueprint: SavedBlueprint) => Promise<SaveFileResult>;
  importBlueprintFile: () => Promise<ImportBlueprintResult>;
  getGeminiSettings: () => Promise<GeminiSettingsInfo>;
  setGeminiApiKey: (apiKey: string) => Promise<GeminiSettingsInfo>;
  generateGeminiStructured: (req: GeminiStructuredRequest) => Promise<unknown>;
  openExternalUrl: (url: string) => Promise<boolean>;
}
