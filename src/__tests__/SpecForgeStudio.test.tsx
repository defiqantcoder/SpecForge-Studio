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

    const viewSelector = within(screen.getByRole('group', { name: /Workspace View Mode/i }));
    const simpleBtn = viewSelector.getByRole('button', { name: 'Simple' });
    const intermediateBtn = viewSelector.getByRole('button', { name: 'Intermediate' });
    const proBtn = viewSelector.getByRole('button', { name: 'Pro' });

    // Header 3-way selector & simplified navigation tabs
    expect(simpleBtn.getAttribute('aria-pressed')).toBe('true');
    expect(intermediateBtn.getAttribute('aria-pressed')).toBe('false');
    expect(proBtn.getAttribute('aria-pressed')).toBe('false');
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
    expect(screen.queryByText(/Top\/Bottom Focus:/i)).toBeNull();
    expect(screen.queryByText(/AI Memory Limits:/i)).toBeNull();

    // Expand all 14 files temporarily inside Simple Mode
    fireEvent.click(screen.getByRole('button', { name: /Show all 14 advanced files/i }));
    expect(screen.getByRole('button', { name: '.github/copilot-instructions.md' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Show 3 essential files only/i }));
    expect(screen.queryByRole('button', { name: '.github/copilot-instructions.md' })).toBeNull();

    // Switch to Pro Mode via 3-way selector
    fireEvent.click(proBtn);
    expect(proBtn.getAttribute('aria-pressed')).toBe('true');
    expect(simpleBtn.getAttribute('aria-pressed')).toBe('false');
    expect(screen.getByRole('button', { name: /2\. Task Prompt Builder \(5 Sections\)/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /3\. AGENTS\.md \(Project Rules\)/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /4\. Copilot, Antigravity & Jules Files/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /5\. Spec & Task Slices/i })).toBeTruthy();
    expect(screen.getByText(/Top\/Bottom Focus:/i)).toBeTruthy();
    expect(screen.getByText(/AI Memory Limits:/i)).toBeTruthy();

    // Verify renamed professional headings across Pro tabs
    fireEvent.click(screen.getByRole('button', { name: /2\. Task Prompt Builder \(5 Sections\)/i }));
    expect(
      screen.getByText(/Top-Priority Rules \(AI Attention Top Section\)/i)
    ).toBeTruthy();
    expect(
      screen.getByText(/Final Instructions \(AI Attention Bottom Section\)/i)
    ).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /5\. Spec & Task Slices/i }));
    expect(
      screen.getByText(/Step-by-Step Goal Checks \(When\/Then Rules\)/i)
    ).toBeTruthy();
    expect(
      screen.getByText(/Step-by-Step Task Breakdown \(Full Features, Not Horizontal Layers\)/i)
    ).toBeTruthy();
  });

  it('supports Intermediate Mode with 4 tabs, jargon translation cards, and 6 core dock files while exporting all 14 files', async () => {
    render(<SpecForgeStudio />);

    await waitFor(() => {
      expect(mockApi.listBlueprints).toHaveBeenCalled();
    });

    const viewSelector = within(screen.getByRole('group', { name: /Workspace View Mode/i }));
    const intermediateBtn = viewSelector.getByRole('button', { name: 'Intermediate' });
    fireEvent.click(intermediateBtn);
    expect(intermediateBtn.getAttribute('aria-pressed')).toBe('true');

    // Intermediate Mode shows 4 essential tabs and hides Guide & Platform Files tabs
    expect(screen.getByRole('button', { name: /1\. Idea & AI Setup/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /2\. Custom AI Prompt/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /3\. Project Rules/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /4\. Feature Checklist/i })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /4\. Copilot, Antigravity & Jules Files/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /0\. How to Use/i })).toBeNull();

    // Right-Hand Artifact Dock shows 6 core files with subtitles (and hides extra files unless expanded)
    expect(screen.getByRole('button', { name: /TASK_PROMPT\.md Your main AI task prompt/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /AGENTS\.md Permanent project rules/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /spec\.md Feature requirements \(EARS\)/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /tasks\.md Step-by-step feature slices/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /constitution\.md Core non-negotiable laws/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /bootstrap-agy\.sh 1-click Antigravity setup/i })).toBeTruthy();
    expect(screen.queryByRole('button', { name: '.github/copilot-instructions.md' })).toBeNull();

    // Navigate to Custom AI Prompt & verify JargonTranslationCard explanations
    fireEvent.click(screen.getByRole('button', { name: /2\. Custom AI Prompt/i }));
    expect(screen.getByText(/Plain-English Guide: Primacy Anchor/i)).toBeTruthy();
    expect(screen.getByText(/Plain-English Guide: State Invariants & TurboModules/i)).toBeTruthy();
    expect(screen.getByText(/Plain-English Guide: Recency Anchor/i)).toBeTruthy();

    // Navigate to Feature Checklist & verify EARS + Vertical Slices jargon cards
    fireEvent.click(screen.getByRole('button', { name: /4\. Feature Checklist/i }));
    expect(screen.getByText(/Plain-English Guide: EARS Notation/i)).toBeTruthy();
    expect(screen.getByText(/Plain-English Guide: Vertical Slices/i)).toBeTruthy();

    // Export to Repo still exports all 14 generated files
    fireEvent.click(screen.getByRole('button', { name: /Export to Repo/i }));
    await waitFor(() => {
      expect(mockApi.exportWorkspaceDialog).toHaveBeenCalledTimes(1);
    });
    const payload = (mockApi.exportWorkspaceDialog as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(payload.files).toHaveLength(14);
  });

  it('translates Intermediate Mode plain-English rule checkboxes and simplified task slicer into technical artifacts', async () => {
    render(<SpecForgeStudio />);

    await waitFor(() => {
      expect(mockApi.listBlueprints).toHaveBeenCalled();
    });

    const viewSelector = within(screen.getByRole('group', { name: /Workspace View Mode/i }));
    fireEvent.click(viewSelector.getByRole('button', { name: 'Intermediate' }));

    // Custom AI Prompt: Plain-English Rule Builder replaces raw textareas
    fireEvent.click(screen.getByRole('button', { name: /2\. Custom AI Prompt/i }));
    expect(
      screen.queryByLabelText(/State Placement & Architectural Boundary Rules/i)
    ).toBeNull();

    fireEvent.click(
      screen.getByLabelText(/Keep data fetching separate from visual design/i)
    );
    fireEvent.click(
      screen.getByLabelText(/Require automated tests to pass before finishing tasks/i)
    );
    fireEvent.click(
      screen.getByLabelText(/Prevent file path hacks or security holes/i)
    );

    const promptPreview = document.querySelector('pre');
    expect(promptPreview?.textContent).toContain('Separate server data fetching from client UI rendering');
    expect(promptPreview?.textContent).toContain('Gate every task completion on passing typecheck');
    expect(promptPreview?.textContent).toContain('Enforce strict path canonicalization');

    // Feature Checklist: Simplified Task Slicer updates title, HITL/AFK mode, and auto-generated layers
    fireEvent.click(screen.getByRole('button', { name: /4\. Feature Checklist/i }));
    const firstTitleInput = screen.getByLabelText('Task 1 title');
    fireEvent.change(firstTitleInput, { target: { value: 'Auth Token Verification Slice' } });

    const hitlCheckboxes = screen.getAllByLabelText(/Needs human review \(\[HITL\]\)/i);
    // Toggle first slice mode
    const initialChecked = (hitlCheckboxes[0] as HTMLInputElement).checked;
    fireEvent.click(hitlCheckboxes[0]);

    // Preview tasks.md to verify output updates with title, mode tag, and auto-generated layers
    fireEvent.click(screen.getByRole('button', { name: /tasks\.md Step-by-step feature slices/i }));
    const tasksPreview = document.querySelector('pre');
    expect(tasksPreview?.textContent).toContain('Auth Token Verification Slice');
    expect(tasksPreview?.textContent).toContain('Auth Schema + Domain Service');
    expect(tasksPreview?.textContent).toContain(initialChecked ? '[AFK]' : '[HITL]');
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

  it('expands input text via ✨ Auto-Expand Options, highlights newly added lines, and clears highlight on Accept All', async () => {
    render(<SpecForgeStudio />);

    await waitFor(() => {
      expect(mockApi.listBlueprints).toHaveBeenCalled();
    });

    const ideaBox = screen.getByLabelText(/What should your app do\?/i) as HTMLTextAreaElement;
    fireEvent.change(ideaBox, {
      target: { value: 'Build a personal budget planner' }
    });

    const expandBtn = screen.getByRole('button', { name: /✨ Auto-Expand Options/i });
    fireEvent.click(expandBtn);

    await waitFor(() => {
      expect(screen.getByTestId('expanded-highlight-plainIdea')).toBeTruthy();
    });

    expect(ideaBox.value).toContain('Build a personal budget planner');
    expect(ideaBox.value).toContain('Provide clear loading, empty, and error feedback states');
    expect(screen.getByText(/Newly Expanded Options/i)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /Accept All/i }));
    expect(screen.queryByTestId('expanded-highlight-plainIdea')).toBeNull();
    // Expanded text remains locked in the textarea
    expect(ideaBox.value).toContain('Provide clear loading, empty, and error feedback states');
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
