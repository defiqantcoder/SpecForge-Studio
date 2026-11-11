import * as fs from 'fs';
import * as path from 'path';

/**
 * Checks whether `candidate` falls outside `realRoot` (or equals `realRoot` when `allowRoot` is false).
 */
function isOutsideRoot(realRoot: string, candidate: string, allowRoot: boolean): boolean {
  const rel = path.relative(realRoot, candidate);
  if (!allowRoot && !rel) return true;
  return rel === '..' || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel);
}

/**
 * Validates and resolves a relative artifact path inside a chosen root directory.
 * Rejects empty paths, absolute paths, null bytes, `..` traversal, trailing dots,
 * and symlink escapes (including dangling symlinks) outside rootDir.
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

  // Canonicalize rootDir upfront when it exists on disk; fall back to path.resolve for non-existent roots.
  let realRoot: string;
  if (typeof fs.realpathSync === 'function') {
    try {
      realRoot = fs.realpathSync(rootDir);
    } catch (err: any) {
      if (err && err.code === 'ENOENT') {
        realRoot = path.resolve(rootDir);
      } else {
        throw err;
      }
    }
  } else {
    realRoot = path.resolve(rootDir);
  }

  const segments = normalizedInput.split('/');
  let currentPath = realRoot;

  for (const segment of segments) {
    if (segment === '' || segment === '.') continue;

    if (segment === '..') {
      currentPath = path.dirname(currentPath);
      if (isOutsideRoot(realRoot, currentPath, true)) {
        throw new Error(`Path traversal rejected: ${relativePath}`);
      }
      continue;
    }

    if (segment.endsWith('.')) {
      throw new Error(`Invalid path: trailing dots are not permitted in segment: ${segment}`);
    }

    // Preserve Windows reserved character restrictions while allowing valid POSIX characters (e.g., ':') on Linux/macOS.
    if (process.platform === 'win32' && /[<>:"|?*]/.test(segment)) {
      throw new Error(`Invalid characters in path segment: ${segment}`);
    }

    currentPath = path.join(currentPath, segment);

    if (typeof fs.realpathSync === 'function') {
      try {
        currentPath = fs.realpathSync(currentPath);
        if (isOutsideRoot(realRoot, currentPath, true)) {
          throw new Error(`Path traversal detected via symlink: ${relativePath}`);
        }
      } catch (err: any) {
        if (err && err.code === 'ENOENT') {
          if (typeof fs.lstatSync === 'function') {
            try {
              const stat = fs.lstatSync(currentPath);
              if (stat.isSymbolicLink()) {
                throw new Error(`Path traversal detected via dangling symlink: ${relativePath}`);
              }
            } catch (lstatErr: any) {
              if (!lstatErr || lstatErr.code !== 'ENOENT') {
                throw lstatErr;
              }
            }
          }
        } else {
          throw err;
        }
      }
    }
  }

  if (isOutsideRoot(realRoot, currentPath, false)) {
    throw new Error(`Path traversal rejected: ${relativePath}`);
  }

  return currentPath;
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
