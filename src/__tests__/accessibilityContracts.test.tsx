import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import SpecForgeStudio from '../SpecForgeStudio';

// Setup mock desktopAPI to prevent errors during rendering
function createMockDesktopAPI() {
  return {
    getPlatform: vi.fn().mockResolvedValue('darwin'),
    getSettings: vi.fn().mockResolvedValue({ theme: 'system', geminiApiKey: '' }),
    setGeminiApiKey: vi.fn().mockResolvedValue(undefined),
    listBlueprints: vi.fn().mockResolvedValue([]),
    saveBlueprint: vi.fn().mockResolvedValue(undefined),
    deleteBlueprint: vi.fn().mockResolvedValue(undefined),
    exportWorkspaceDialog: vi.fn().mockResolvedValue({ success: true, folderPath: '/mock/path' }),
    generateGeminiStructured: vi.fn().mockResolvedValue({ artifacts: {} }),
    openExternalUrl: vi.fn().mockResolvedValue(undefined),
    getAppInfo: vi.fn().mockResolvedValue({ version: '1.0.0', name: 'SpecForge' }),
    getGeminiSettings: vi.fn().mockResolvedValue({ geminiApiKey: '' })
  };
}

describe('Accessibility Contracts', () => {
  let mockApi: ReturnType<typeof createMockDesktopAPI>;

  beforeEach(() => {
    localStorage.clear();
    mockApi = createMockDesktopAPI();
    // @ts-ignore
    window.desktopAPI = mockApi;
  });

  it('verifies that 3-way view mode selector buttons toggle aria-pressed', async () => {
    render(<SpecForgeStudio />);

    await waitFor(() => {
      expect(mockApi.listBlueprints).toHaveBeenCalled();
    });

    const viewSelector = within(screen.getByRole('group', { name: /Workspace View Mode/i }));
    const simpleBtn = viewSelector.getByRole('button', { name: 'Simple' });
    const intermediateBtn = viewSelector.getByRole('button', { name: 'Intermediate' });
    const proBtn = viewSelector.getByRole('button', { name: 'Pro' });

    // Initial state: Simple mode should be active by default
    expect(simpleBtn.getAttribute('aria-pressed')).toBe('true');
    expect(intermediateBtn.getAttribute('aria-pressed')).toBe('false');
    expect(proBtn.getAttribute('aria-pressed')).toBe('false');

    // Click Intermediate
    fireEvent.click(intermediateBtn);
    expect(simpleBtn.getAttribute('aria-pressed')).toBe('false');
    expect(intermediateBtn.getAttribute('aria-pressed')).toBe('true');
    expect(proBtn.getAttribute('aria-pressed')).toBe('false');

    // Click Pro
    fireEvent.click(proBtn);
    expect(simpleBtn.getAttribute('aria-pressed')).toBe('false');
    expect(intermediateBtn.getAttribute('aria-pressed')).toBe('false');
    expect(proBtn.getAttribute('aria-pressed')).toBe('true');

    // Click Simple again
    fireEvent.click(simpleBtn);
    expect(simpleBtn.getAttribute('aria-pressed')).toBe('true');
    expect(intermediateBtn.getAttribute('aria-pressed')).toBe('false');
    expect(proBtn.getAttribute('aria-pressed')).toBe('false');
  });

  it('verifies Simple Mode platform, AI tool, and execution style pickers maintain accurate aria-pressed attributes', async () => {
    render(<SpecForgeStudio />);

    await waitFor(() => {
      expect(mockApi.listBlueprints).toHaveBeenCalled();
    });

    // Pickers are rendered in Simple Mode, which is the default.

    // Platform Picker Test
    // Default is "Web App"
    const webBtn = screen.getByRole('button', { name: /Website \/ Web App/i });
    const phoneBtn = screen.getByRole('button', { name: /Phone App/i });
    expect(webBtn.getAttribute('aria-pressed')).toBe('true');
    expect(phoneBtn.getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(phoneBtn);
    expect(webBtn.getAttribute('aria-pressed')).toBe('false');
    expect(phoneBtn.getAttribute('aria-pressed')).toBe('true');

    // AI Tool Picker Test
    // Default is Antigravity
    const antigravityBtn = screen.getByRole('button', { name: /Antigravity/i });
    const julesBtn = screen.getByRole('button', { name: /Google Jules/i });
    expect(antigravityBtn.getAttribute('aria-pressed')).toBe('true');
    expect(julesBtn.getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(julesBtn);
    expect(antigravityBtn.getAttribute('aria-pressed')).toBe('false');
    expect(julesBtn.getAttribute('aria-pressed')).toBe('true');

    // Execution Style Picker Test
    // Default is HITL
    const hitlBtn = screen.getByRole('button', { name: /Step-by-Step with Me Watching/i });
    const afkBtn = screen.getByRole('button', { name: /Build It Automatically in the Background/i });
    expect(hitlBtn.getAttribute('aria-pressed')).toBe('true');
    expect(afkBtn.getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(afkBtn);
    expect(hitlBtn.getAttribute('aria-pressed')).toBe('false');
    expect(afkBtn.getAttribute('aria-pressed')).toBe('true');
  });

  it('verifies that primary inputs (#plain-idea-input, #user-persona-input) are accessible via their associated labels', async () => {
    render(<SpecForgeStudio />);

    await waitFor(() => {
      expect(mockApi.listBlueprints).toHaveBeenCalled();
    });

    // plainIdea input check
    // The label is: What should your app do?
    const ideaInput = screen.getByLabelText(/What should your app do\?/i);
    expect(ideaInput.id).toBe('plain-idea-input');
    expect(ideaInput.tagName.toLowerCase()).toBe('textarea');

    // userPersona input check
    // The label is: Who will use this app?
    const personaInput = screen.getByLabelText(/Who will use this app\?/i);
    expect(personaInput.id).toBe('user-persona-input');
    expect(personaInput.tagName.toLowerCase()).toBe('input');
  });

  it('verifies Blueprints modal traps focus, applies ARIA semantics, and closes on Escape', async () => {
    render(<SpecForgeStudio />);

    await waitFor(() => {
      expect(mockApi.listBlueprints).toHaveBeenCalled();
    });

    const openButton = screen.getByRole('button', { name: /Blueprints \(/i });
    openButton.focus();
    fireEvent.click(openButton);

    const dialog = screen.getByRole('dialog', { name: /Local Desktop Blueprints/i });
    expect(dialog).not.toBeNull();
    expect(dialog.getAttribute('aria-modal')).toBe('true');

    // Press Escape to close
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /Local Desktop Blueprints/i })).toBeNull();
    });

    // Focus should be restored to the button that opened it
    expect(document.activeElement).toBe(openButton);
  });

  it('verifies AI Settings modal traps focus, applies ARIA semantics, and closes on Escape', async () => {
    render(<SpecForgeStudio />);

    await waitFor(() => {
      expect(mockApi.listBlueprints).toHaveBeenCalled();
    });

    const openButton = screen.getByRole('button', { name: /AI Key/i });
    openButton.focus();
    fireEvent.click(openButton);

    const dialog = screen.getByRole('dialog', { name: /Desktop AI Settings/i });
    expect(dialog).not.toBeNull();
    expect(dialog.getAttribute('aria-modal')).toBe('true');

    // Press Escape to close
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /Desktop AI Settings/i })).toBeNull();
    });

    // Focus should be restored to the button that opened it
    expect(document.activeElement).toBe(openButton);
  });

});
