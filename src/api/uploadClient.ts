import type { UploadErrorResponse, UploadResponse } from '../types/upload';

export async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const data: UploadResponse | UploadErrorResponse = await response.json();

  if (!response.ok) {
    throw new Error('error' in data ? data.error : 'Upload failed.');
  }

  return data;
}
