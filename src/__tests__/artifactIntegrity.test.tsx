import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import SpecForgeStudio from '../SpecForgeStudio';
import type { DesktopAPI } from '../types/desktop';

function createMockDesktopAPI(): DesktopAPI {
  return {
    isDesktop: true,
    getAppInfo: vi.fn().mockResolvedValue({
      name: 'SpecForge Studio',
      version: '1.0.0',
      platform: 'linux',
      arch: 'x64',
      osRelease: 'Linux 6.8.0',
      userDataDir: '/home/test/.config/SpecForge Studio',
      blueprintsDir: '/home/test/.config/SpecForge Studio/blueprints'
    }),
    copyToClipboard: vi.fn().mockResolvedValue(true),
    saveFileDialog: vi.fn().mockResolvedValue({
      canceled: false,
      filePath: '/tmp/test.md'
    }),
    exportWorkspaceDialog: vi.fn().mockResolvedValue({
      canceled: false,
      basePath: '/tmp/export'
    }),
    listBlueprints: vi.fn().mockResolvedValue([]),
    saveBlueprint: vi.fn().mockResolvedValue({ id: '1', title: 'test', updatedAt: 1, formState: '{}' }),
    deleteBlueprint: vi.fn().mockResolvedValue(true),
    exportBlueprintFile: vi.fn().mockResolvedValue({ canceled: false }),
    importBlueprintFile: vi.fn().mockResolvedValue({ canceled: false }),
    getGeminiSettings: vi.fn().mockResolvedValue({ hasKey: false, source: 'none' }),
    setGeminiApiKey: vi.fn().mockResolvedValue({ hasKey: true, source: 'stored', maskedKey: 'AIza...' }),
    generateGeminiStructured: vi.fn().mockResolvedValue({}),
    openExternalUrl: vi.fn().mockResolvedValue(true),
  };
}

describe('Artifact Integrity Test', () => {
  let mockApi: DesktopAPI;

  beforeEach(() => {
    vi.clearAllMocks();
    mockApi = createMockDesktopAPI();
    window.desktopAPI = mockApi;
    localStorage.clear();
  });

  it('validates structural integrity of all 14 generated output files in Pro mode', async () => {
    render(<SpecForgeStudio />);

    await waitFor(() => {
      expect(mockApi.listBlueprints).toHaveBeenCalled();
    });

    const viewSelector = within(screen.getByRole('group', { name: /Workspace View Mode/i }));
    const proBtn = viewSelector.getByRole('button', { name: 'Pro' });
    fireEvent.click(proBtn);
    expect(proBtn.getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(screen.getByRole('button', { name: /Export to Repo/i }));
    await waitFor(() => {
      expect(mockApi.exportWorkspaceDialog).toHaveBeenCalledTimes(1);
    });

    const payload = (mockApi.exportWorkspaceDialog as ReturnType<typeof vi.fn>).mock.calls[0][0];
    const files = payload.files;

    // 1. Verify 14 files
    expect(files).toHaveLength(14);

    // Verify non-empty content
    for (const file of files) {
      expect(file.content.trim().length).toBeGreaterThan(0);
    }

    // 2. Verify bootstrap-agy.sh
    const bootstrapAgy = files.find((f: any) => f.relativePath === 'bootstrap-agy.sh');
    expect(bootstrapAgy).toBeDefined();
    expect(bootstrapAgy.content).toMatch(/mkdir -p/);

    // Count opening heredocs with EOF and closing EOFs
    const openingEOF = (bootstrapAgy.content.match(/<<\s*['"]?EOF[^'"]*['"]?/g) || []).length;
    const closingEOF = (bootstrapAgy.content.match(/^EOF_.*$/gm) || []).length;

    expect(openingEOF).toBeGreaterThan(0);
    expect(openingEOF).toEqual(closingEOF);

    // 3. Verify Antigravity rule size limit
    const ruleFile = files.find((f: any) => /^\.agents\/rules\/[^/]+\.md$/.test(f.relativePath));
    expect(ruleFile).toBeDefined();

    // Antigravity limit is 24000 bytes
    const ruleFileBytes = new Blob([ruleFile.content]).size;
    expect(ruleFileBytes).toBeLessThan(24000);
  });
});
