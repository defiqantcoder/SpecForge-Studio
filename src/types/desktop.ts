import type { DesktopAPI } from '../../electron/types';

export type {
  SavedBlueprint,
  ExportWorkspaceRequest,
  ExportWorkspaceResult,
  SaveFileResult,
  ImportBlueprintResult,
  DesktopAppInfo,
  GeminiSettingsInfo,
  GeminiStructuredRequest,
  DesktopAPI
} from '../../electron/types';

declare global {
  interface Window {
    desktopAPI?: DesktopAPI;
  }
}
