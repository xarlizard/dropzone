import type { UploadResponse } from '../types/upload.js';
import { TEXT_SNIPPET_LENGTH } from './constants.js';

export function buildTextPreview(
  buffer: Buffer,
): Pick<UploadResponse, 'metadata' | 'preview'> {
  const text = buffer.toString('utf8');
  const lines = text.split(/\r?\n/).length;

  return {
    metadata: {
      characters: text.length,
      lines,
    },
    preview: {
      text: text.slice(0, TEXT_SNIPPET_LENGTH),
    },
  };
}
