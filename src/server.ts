import express from 'express';
import { fileTypeFromBuffer } from 'file-type';
import multer from 'multer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TEXT_SNIPPET_LENGTH = 500;

const IMAGE_MIMES = new Set(['image/png', 'image/jpeg']);
const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg']);
const TEXT_MIMES = new Set(['text/plain', 'application/json']);
const TEXT_EXTENSIONS = new Set(['txt', 'text', 'json']);
const PDF_MIMES = new Set(['application/pdf']);
const ZIP_MIMES = new Set(['application/zip', 'application/x-zip-compressed']);

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.static(path.join(__dirname, '..', 'public')));

type FileKind = 'text' | 'image' | 'pdf' | 'zip' | 'unsupported';

type UploadResponse = {
  name: string;
  declared_type: string;
  size: number;
  detected_type: string | null;
  detected_ext: string | null;
  kind: FileKind;
  metadata: Record<string, string | number | null>;
  preview?: {
    image?: string;
    text?: string;
  };
};

function extensionFromName(filename: string): string | null {
  const ext = path.extname(filename).slice(1).toLowerCase();
  return ext || null;
}

async function buildImagePreview(
  buffer: Buffer,
  mime: string,
): Promise<Pick<UploadResponse, 'metadata' | 'preview'>> {
  const sourceMeta = await sharp(buffer).metadata();

  if (sourceMeta.format !== 'png' && sourceMeta.format !== 'jpeg') {
    throw new Error('Only PNG and JPEG images are supported.');
  }

  const thumbnail = await sharp(buffer)
    .resize(200, 200, { fit: 'inside', withoutEnlargement: true })
    .toBuffer();
  const thumbMeta = await sharp(thumbnail).metadata();
  const previewMime = thumbMeta.format === 'png' ? 'image/png' : 'image/jpeg';

  return {
    metadata: {
      width: sourceMeta.width ?? null,
      height: sourceMeta.height ?? null,
      format: sourceMeta.format ?? null,
      thumbnail_width: thumbMeta.width ?? null,
      thumbnail_height: thumbMeta.height ?? null,
    },
    preview: {
      image: `data:${previewMime};base64,${thumbnail.toString('base64')}`,
    },
  };
}

function buildTextPreview(buffer: Buffer): Pick<UploadResponse, 'metadata' | 'preview'> {
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

async function classifyFile(
  buffer: Buffer,
  filename: string,
  declaredType: string,
): Promise<{ kind: FileKind; mime: string | null; ext: string | null }> {
  const detected = await fileTypeFromBuffer(buffer);
  const detectedMime = detected?.mime ?? null;
  const detectedExt = detected?.ext ?? null;
  const nameExt = extensionFromName(filename);

  if (detectedMime && IMAGE_MIMES.has(detectedMime)) {
    return { kind: 'image', mime: detectedMime, ext: detectedExt };
  }

  if (detectedMime && PDF_MIMES.has(detectedMime)) {
    return { kind: 'pdf', mime: detectedMime, ext: detectedExt };
  }

  if (detectedMime && ZIP_MIMES.has(detectedMime)) {
    return { kind: 'zip', mime: detectedMime, ext: detectedExt };
  }

  if (detectedMime && TEXT_MIMES.has(detectedMime)) {
    return { kind: 'text', mime: detectedMime, ext: detectedExt };
  }

  if (nameExt && IMAGE_EXTENSIONS.has(nameExt)) {
    return {
      kind: 'image',
      mime: detectedMime ?? (nameExt === 'png' ? 'image/png' : 'image/jpeg'),
      ext: nameExt,
    };
  }

  if (nameExt === 'pdf') {
    return { kind: 'pdf', mime: detectedMime ?? 'application/pdf', ext: 'pdf' };
  }

  if (nameExt === 'zip') {
    return { kind: 'zip', mime: detectedMime ?? 'application/zip', ext: 'zip' };
  }

  if (nameExt && TEXT_EXTENSIONS.has(nameExt)) {
    return {
      kind: 'text',
      mime:
        detectedMime ??
        (nameExt === 'json' ? 'application/json' : declaredType || 'text/plain'),
      ext: nameExt,
    };
  }

  if (declaredType && TEXT_MIMES.has(declaredType)) {
    return { kind: 'text', mime: declaredType, ext: nameExt };
  }

  return { kind: 'unsupported', mime: detectedMime, ext: detectedExt ?? nameExt };
}

app.post('/api/upload', upload.single('file'), async (req, res) => {
  const file = req.file;

  if (!file) {
    res.status(400).json({ error: 'No file uploaded.' });
    return;
  }
  let kind, mime, ext = null;

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
    if(kind == "image") {
      const message = 'There is an error with the image file.';
      res.status(415).json({
        error: message,
      });
      return;
    } else {
      const message = err instanceof Error ? err.message : 'File processing failed.';
      res.status(422).json({ error: message });
      return;
    }
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
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Dropzone exercise running at http://localhost:${PORT}`);
});
