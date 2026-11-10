import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
      filePath: '/home/test/TASK_PROMPT.md'
    }),
    exportWorkspaceDialog: vi.fn().mockResolvedValue({
      canceled: false,
      targetDir: '/home/test/my-repo',
      writtenCount: 14,
      writtenFiles: ['AGENTS.md', 'TASK_PROMPT.md']
    }),
    listBlueprints: vi.fn().mockResolvedValue([]),
    saveBlueprint: vi.fn().mockImplementation(async (bp) => ({
      id: bp.id || 'my-app',
      title: bp.title,
      tag: bp.tag || '',
      updatedAt: Date.now(),
      formState: bp.formState
    })),
    deleteBlueprint: vi.fn().mockResolvedValue(true),
    exportBlueprintFile: vi.fn().mockResolvedValue({ canceled: true }),
    importBlueprintFile: vi.fn().mockResolvedValue({ canceled: true }),
    getGeminiSettings: vi.fn().mockResolvedValue({ hasKey: false, source: 'none' }),
    setGeminiApiKey: vi.fn().mockResolvedValue({
      hasKey: true,
      source: 'stored',
      maskedKey: 'AIza••••1234'
    }),
    generateGeminiStructured: vi.fn().mockResolvedValue({}),
    openExternalUrl: vi.fn().mockResolvedValue(true)
  };
}

describe('SpecForgeStudio Desktop UI', () => {
  let mockApi: DesktopAPI;

  beforeEach(() => {
    localStorage.clear();
    mockApi = createMockDesktopAPI();
    window.desktopAPI = mockApi;
  });

  it('renders Ubuntu Desktop header, navigation tabs, and live artifact dock', async () => {
    render(<SpecForgeStudio />);
    expect(screen.getByText('SpecForge Studio')).toBeTruthy();
    expect(screen.getByText('Ubuntu Desktop')).toBeTruthy();
    expect(screen.getByRole('button', { name: /Export to Repo/i })).toBeTruthy();

    await waitFor(() => {
      expect(mockApi.listBlueprints).toHaveBeenCalled();
    });
  });

  it('exports all 14 generated files in Simple Mode via desktopAPI.exportWorkspaceDialog', async () => {
    render(<SpecForgeStudio />);
    const exportBtn = screen.getByRole('button', { name: /Export to Repo/i });
    fireEvent.click(exportBtn);

    await waitFor(() => {
      expect(mockApi.exportWorkspaceDialog).toHaveBeenCalledTimes(1);
    });
    const callArg = (mockApi.exportWorkspaceDialog as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(callArg.files).toHaveLength(14);
    expect(callArg.files.some((f: { relativePath: string }) => f.relativePath === 'AGENTS.md')).toBe(
      true
    );
    expect(
      callArg.files.some((f: { relativePath: string }) => f.relativePath === 'TASK_PROMPT.md')
    ).toBe(true);
    expect(
      callArg.files.some(
        (f: { relativePath: string }) => f.relativePath === '.specify/memory/constitution.md'
      )
    ).toBe(true);
  });

  it('defaults to Simple Mode with 2 tabs and 3 dock pills, then reveals all 6 tabs and diagnostics in Pro Mode', async () => {
    render(<SpecForgeStudio />);

    await waitFor(() => {
      expect(mockApi.listBlueprints).toHaveBeenCalled();
    });

    // Header toggle & simplified navigation tabs
    expect(screen.getByRole('button', { name: /Simple Mode \(No-Code\)/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /1\. Describe Your App/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /2\. How to Use Your Files/i })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /2\. Task Prompt Builder/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /5\. Spec & Task Slices/i })).toBeNull();
    expect(
      screen.getByRole('button', {
        name: /Switch to Pro Mode to edit 5-Section Prompts, AGENTS\.md & EARS Specs/i
      })
    ).toBeTruthy();

    // Decluttered right-hand dock in Simple Mode
    expect(screen.getByRole('button', { name: /📋 1\. Copy-Paste AI Prompt/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /🤖 2\. Project Rules \(AGENTS\.md\)/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /⚡ 3\. 1-Click Auto-Setup/i })).toBeTruthy();
    expect(screen.queryByRole('button', { name: '.github/copilot-instructions.md' })).toBeNull();
    expect(screen.queryByText(/Primacy\/Recency:/i)).toBeNull();

    // Expand all 14 files temporarily inside Simple Mode
    fireEvent.click(screen.getByRole('button', { name: /Show all 14 advanced files/i }));
    expect(screen.getByRole('button', { name: '.github/copilot-instructions.md' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Show 3 essential files only/i }));
    expect(screen.queryByRole('button', { name: '.github/copilot-instructions.md' })).toBeNull();

    // Switch to Pro Mode via header button
    fireEvent.click(screen.getByRole('button', { name: /Simple Mode \(No-Code\)/i }));
    expect(screen.getByRole('button', { name: /Pro Mode \(All 14 Files\)/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /2\. Task Prompt Builder \(5 Sections\)/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /3\. AGENTS\.md \(Project Rules\)/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /4\. Copilot, Antigravity & Jules Files/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /5\. Spec & Task Slices/i })).toBeTruthy();
    expect(screen.getByText(/Primacy\/Recency:/i)).toBeTruthy();
  });

  it('uses Offline Smart Templates when clicking Turn My Idea Into AI Instructions without an API key', async () => {
    render(<SpecForgeStudio />);

    await waitFor(() => {
      expect(mockApi.listBlueprints).toHaveBeenCalled();
    });

    // Visual pickers are rendered in Simple Mode
    expect(screen.getByRole('button', { name: /Phone App/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Google Jules/i })).toBeTruthy();
    expect(
      screen.getByRole('button', { name: /Build It Automatically in the Background/i })
    ).toBeTruthy();

    fireEvent.click(
      screen.getByRole('button', { name: /Runs on Ubuntu, Windows, or Mac desktop/i })
    );
    fireEvent.click(screen.getByRole('button', { name: /Google Jules/i }));

    const ideaBox = screen.getByLabelText(/What should your app do\?/i);
    fireEvent.change(ideaBox, {
      target: { value: 'Build a personal habit streak tracker with daily reminders' }
    });

    fireEvent.click(
      screen.getByRole('button', { name: /Step 1: Turn My Idea Into AI Instructions/i })
    );

    expect(
      screen.getByText(/Built your custom AI instructions using Offline Smart Templates!/i)
    ).toBeTruthy();
    expect(mockApi.generateGeminiStructured).not.toHaveBeenCalled();

    // TASK_PROMPT.md live preview should now include the user's plain-English idea
    const promptPreview = document.querySelector('pre');
    expect(promptPreview?.textContent).toContain(
      'Build a personal habit streak tracker with daily reminders'
    );
  });

  it('opens AI Settings modal and saves Gemini API key via desktopAPI', async () => {
    render(<SpecForgeStudio />);
    fireEvent.click(screen.getByTitle(/Configure optional Gemini API key/i));
    const input = screen.getByPlaceholderText('AIza...');
    fireEvent.change(input, { target: { value: 'AIzaTestKey1234' } });
    fireEvent.click(screen.getByRole('button', { name: /Save API Key/i }));

    await waitFor(() => {
      expect(mockApi.setGeminiApiKey).toHaveBeenCalledWith('AIzaTestKey1234');
    });
  });
});
