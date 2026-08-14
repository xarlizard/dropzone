import type { Request, Response } from 'express';
import type { UploadResponse } from '../types/upload.js';
import { classifyFile } from '../utils/fileClassifier.js';
import { buildImagePreview } from '../utils/imagePreview.js';
import { buildTextPreview } from '../utils/textPreview.js';

export async function handleUpload(req: Request, res: Response): Promise<void> {
  const file = req.file;

  if (!file) {
    res.status(400).json({ error: 'No file uploaded.' });
    return;
  }

  let kind: UploadResponse['kind'] | undefined;
  let mime: string | null = null;
  let ext: string | null = null;

  try {
    ({ kind, mime, ext } = await classifyFile(
      file.buffer,
      file.originalname,
      file.mimetype,
    ));

    if (kind === 'unsupported') {
      res.status(415).json({
        error: 'Unsupported file type. Supported: PNG, JPEG, plain text, JSON, PDF, and ZIP.',
      });
      return;
    }
  } catch (err) {
    if (kind === 'image') {
      res.status(415).json({ error: 'There is an error with the image file.' });
      return;
    }

    const message = err instanceof Error ? err.message : 'File processing failed.';
    res.status(422).json({ error: message });
    return;
  }

  const response: UploadResponse = {
    name: file.originalname,
    declared_type: file.mimetype,
    size: file.size,
    detected_type: mime,
    detected_ext: ext,
    kind,
    metadata: {},
  };

  try {
    if (kind === 'image') {
      Object.assign(response, await buildImagePreview(file.buffer, mime ?? file.mimetype));
    } else if (kind === 'text') {
      Object.assign(response, buildTextPreview(file.buffer));
    }

    res.json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'File processing failed.';
    res.status(422).json({ error: message });
  }
}
