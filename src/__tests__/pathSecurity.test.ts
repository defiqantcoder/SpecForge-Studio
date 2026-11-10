import { describe, expect, it } from 'vitest';
import * as path from 'path';
import { resolveSafeChildPath, sanitizeBlueprintId } from '../../electron/pathSecurity';

describe('resolveSafeChildPath', () => {
  const root = '/home/sinnoh/projects/demo-repo';

  it('resolves valid nested relative paths safely inside rootDir', () => {
    expect(resolveSafeChildPath(root, 'AGENTS.md')).toBe(path.join(root, 'AGENTS.md'));
    expect(resolveSafeChildPath(root, '.agents/rules/architecture-boundaries.md')).toBe(
      path.join(root, '.agents', 'rules', 'architecture-boundaries.md')
    );
    expect(resolveSafeChildPath(root, '.github/workflows/copilot-setup-steps.yml')).toBe(
      path.join(root, '.github', 'workflows', 'copilot-setup-steps.yml')
    );
  });

  it('rejects parent directory traversal attempts', () => {
    expect(() => resolveSafeChildPath(root, '../etc/passwd')).toThrow(/Path traversal/);
    expect(() => resolveSafeChildPath(root, '.agents/../../outside.txt')).toThrow(/Path traversal/);
    expect(() => resolveSafeChildPath(root, '..')).toThrow(/Path traversal/);
  });

  it('rejects absolute paths and null bytes', () => {
    expect(() => resolveSafeChildPath(root, '/etc/passwd')).toThrow(/Absolute paths/);
    expect(() => resolveSafeChildPath(root, 'foo\0bar.md')).toThrow(/null byte/);
    expect(() => resolveSafeChildPath(root, '')).toThrow(/empty/);
  });
});

describe('sanitizeBlueprintId', () => {
  it('normalizes project titles into safe filename slugs', () => {
    expect(sanitizeBlueprintId('My Invoice Approval App!')).toBe('my-invoice-approval-app');
    expect(sanitizeBlueprintId('../../../evil')).toBe('evil');
  });

  it('falls back to timestamped blueprint id if empty after sanitization', () => {
    expect(sanitizeBlueprintId('///')).toMatch(/^blueprint-\d+$/);
  });
});
