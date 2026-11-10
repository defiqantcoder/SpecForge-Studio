import * as path from 'path';

/**
 * Validates and resolves a relative artifact path inside a chosen root directory.
 * Rejects empty paths, absolute paths, null bytes, and any `..` traversal outside rootDir.
 */
export function resolveSafeChildPath(rootDir: string, relativePath: string): string {
  if (!relativePath || typeof relativePath !== 'string') {
    throw new Error('Invalid relative path: empty');
  }
  if (relativePath.includes('\0')) {
    throw new Error('Invalid relative path: null byte');
  }

  const normalizedInput = relativePath.replace(/\\/g, '/').trim();
  if (path.isAbsolute(normalizedInput) || normalizedInput.startsWith('/')) {
    throw new Error(`Absolute paths are not permitted: ${relativePath}`);
  }

  const resolvedRoot = path.resolve(rootDir);
  const resolvedTarget = path.resolve(resolvedRoot, normalizedInput);
  const rel = path.relative(resolvedRoot, resolvedTarget);

  if (rel === '..' || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel)) {
    throw new Error(`Path traversal rejected: ${relativePath}`);
  }

  return resolvedTarget;
}

/**
 * Sanitizes a blueprint ID or filename slug so it can only reference a single safe JSON file.
 */
export function sanitizeBlueprintId(raw: string): string {
  const cleaned = String(raw || '')
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return cleaned || `blueprint-${Date.now()}`;
}
