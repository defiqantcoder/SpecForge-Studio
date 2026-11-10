import * as path from 'path';
import * as fs from 'fs';

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

  // Canonicalize rootDir upfront
  // The test suite passes a fake root '/home/sinnoh/projects/demo-repo'
  let realRoot;
  try {
    realRoot = fs.realpathSync(rootDir);
  } catch (e: any) {
    // If rootDir does not exist, resolve it to normalized absolute path
    // We shouldn't fail if the root itself is just a virtual test path that doesn't exist
    if (e.code === 'ENOENT') {
      realRoot = path.resolve(rootDir);
    } else {
      throw e;
    }
  }

  const segments = normalizedInput.split('/');

  let currentPath = realRoot;
  for (const segment of segments) {
    if (segment === '') continue; // handle redundant separators
    if (segment === '.') continue; // handle dot

    if (segment === '..') {
      currentPath = path.dirname(currentPath);
      // Ensure we haven't traversed outside realRoot
      if (!currentPath.startsWith(realRoot) || (currentPath !== realRoot && !currentPath.startsWith(realRoot + path.sep))) {
        throw new Error(`Path traversal rejected: ${relativePath}`);
      }
      continue;
    }

    if (segment.endsWith('.')) {
      throw new Error(`Invalid path: trailing dots are not permitted in segment: ${segment}`);
    }

    if (/[<>:"|?*]/.test(segment)) {
      throw new Error(`Invalid characters in path segment: ${segment}`);
    }

    currentPath = path.join(currentPath, segment);

    try {
      currentPath = fs.realpathSync(currentPath);
      if (!currentPath.startsWith(realRoot + path.sep) && currentPath !== realRoot) {
         throw new Error(`Path traversal detected via symlink: ${relativePath}`);
      }
    } catch (e: any) {
      if (e.code !== 'ENOENT') {
         throw e;
      }
    }
  }

  const rel = path.relative(realRoot, currentPath);
  if (!rel || rel === '..' || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel)) {
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
