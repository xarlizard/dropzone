import path from 'node:path';

export function extensionFromName(filename: string): string | null {
  const ext = path.extname(filename).slice(1).toLowerCase();
  return ext || null;
}
