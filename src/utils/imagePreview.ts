import sharp from 'sharp';
import type { UploadResponse } from '../types/upload.js';

export async function buildImagePreview(
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
