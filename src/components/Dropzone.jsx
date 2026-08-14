import { useRef, useState } from 'react';
import { uploadFile } from '../api/uploadClient';
import { UploadResult } from './UploadResult';

export function Dropzone() {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFile = async (file) => {
    setLoading(true);
    setLoadingMessage(`Uploading ${file.name}...`);
    setResult(null);
    setError(null);

    try {
      const data = await uploadFile(file);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  const onDragEnter = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const onDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = (event) => {
    event.preventDefault();
    setDragOver(false);
  };

  const onDrop = (event) => {
    event.preventDefault();
    setDragOver(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      void handleFile(file);
    }
  };

  const onFileInputChange = () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      void handleFile(file);
    }
  };

  return (
    <>
      <div
        className={`zone${dragOver ? ' dragover' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            fileInputRef.current?.click();
          }
        }}
      >
        Drop a file here, or click to choose one
      </div>
      <input
        ref={fileInputRef}
        type="file"
        hidden
        onChange={onFileInputChange}
      />
      <UploadResult
        data={result}
        error={error}
        loading={loading}
        loadingMessage={loadingMessage}
      />
    </>
  );
}
