import { describe, expect, it, beforeAll, afterAll, vi } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { resolveSafeChildPath, sanitizeBlueprintId } from '../../electron/pathSecurity';

vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('fs')>();
  return { ...actual, lstatSync: vi.fn(actual.lstatSync) };
});

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

  it('handles mixed and trailing slashes safely', () => {
    expect(resolveSafeChildPath(root, 'foo\\bar/baz')).toBe(path.join(root, 'foo', 'bar', 'baz'));
    expect(resolveSafeChildPath(root, 'foo/bar/')).toBe(path.join(root, 'foo', 'bar'));
  });

  it('handles safe dot-segments and rejects root-equivalent dot path', () => {
    expect(resolveSafeChildPath(root, './AGENTS.md')).toBe(path.join(root, 'AGENTS.md'));
    expect(() => resolveSafeChildPath(root, '.')).toThrow(/Path traversal/);
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

describe('resolveSafeChildPath symlink handling', () => {
  let tmpDir: string;
  let realRoot: string;
  let symRoot: string;
  let outsideDir: string;

  beforeAll(() => {
    tmpDir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'pathSecurity-')));
    realRoot = path.join(tmpDir, 'real-root');
    symRoot = path.join(tmpDir, 'sym-root');
    outsideDir = path.join(tmpDir, 'outside');

    fs.mkdirSync(realRoot);
    fs.mkdirSync(outsideDir);
    fs.symlinkSync(realRoot, symRoot);

    // Create nested symlink escaping to outsideDir
    const innerDir = path.join(realRoot, 'inner');
    fs.mkdirSync(innerDir);
    fs.symlinkSync(outsideDir, path.join(innerDir, 'escape'));
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('handles root directory that is itself a symlink to another directory', () => {
    const result = resolveSafeChildPath(symRoot, 'inner/file.txt');
    expect(result).toBe(path.join(realRoot, 'inner', 'file.txt'));
  });

  it('rejects deeply nested relative paths where multiple subdirectories are symlinks escaping out', () => {
    expect(() => resolveSafeChildPath(symRoot, 'inner/escape/secret.txt')).toThrow(/Path traversal detected via symlink/);
  });

  it('normalizes windows style backslashes', () => {
    const result = resolveSafeChildPath(symRoot, 'inner\\file.txt');
    expect(result).toBe(path.join(realRoot, 'inner', 'file.txt'));
  });

  it.each(['inside', 'outside'])('rejects dangling symlinks targeting missing paths %s root', (target) => {
    const linkName = `dangling-${target}`;
    const targetDir = target === 'inside' ? realRoot : outsideDir;
    fs.symlinkSync(path.join(targetDir, 'missing'), path.join(realRoot, linkName));

    expect(() => resolveSafeChildPath(symRoot, linkName)).toThrow(/Path traversal detected via symlink/);
    expect(() => resolveSafeChildPath(symRoot, `${linkName}/file.txt`)).toThrow(/Path traversal detected via symlink/);
  });

  it('preserves the fallback for genuinely nonexistent nested paths', () => {
    expect(resolveSafeChildPath(symRoot, 'missing/nested/file.txt')).toBe(
      path.join(realRoot, 'missing', 'nested', 'file.txt')
    );
  });

  it('allows existing symlinks whose targets remain inside root', () => {
    fs.symlinkSync(path.join(realRoot, 'inner'), path.join(realRoot, 'safe-link'));
    expect(resolveSafeChildPath(symRoot, 'safe-link/file.txt')).toBe(path.join(realRoot, 'inner', 'file.txt'));
  });

  it('propagates unexpected lstat errors', () => {
    const error = Object.assign(new Error('Permission denied'), { code: 'EACCES' });
    const stat = vi.mocked(fs.lstatSync).mockImplementationOnce(() => { throw error; });
    try {
      expect(() => resolveSafeChildPath(symRoot, 'missing/file.txt')).toThrow(error);
    } finally {
      stat.mockReset();
    }
  });
});

describe('sanitizeBlueprintId', () => {
  it('normalizes project titles into safe filename slugs', () => {
    expect(sanitizeBlueprintId('My Invoice Approval App!')).toBe('my-invoice-approval-app');
    expect(sanitizeBlueprintId('../../../evil')).toBe('evil');
  });

  it('handles empty/whitespace blueprint titles safely', () => {
    expect(sanitizeBlueprintId('   ')).toMatch(/^blueprint-\d+$/);
    expect(sanitizeBlueprintId('')).toMatch(/^blueprint-\d+$/);
    expect(sanitizeBlueprintId(null as any)).toMatch(/^blueprint-\d+$/);
    expect(sanitizeBlueprintId(undefined as any)).toMatch(/^blueprint-\d+$/);
  });

  it('falls back to timestamped blueprint id if empty after sanitization', () => {
    expect(sanitizeBlueprintId('///')).toMatch(/^blueprint-\d+$/);
  });
});
