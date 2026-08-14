import { MetadataList } from './MetadataList';

export function UploadResult({ data, error, loading, loadingMessage }) {
  if (!loading && !data && !error) {
    return null;
  }

  if (error) {
    return <div className="result error">{error}</div>;
  }

  if (loading) {
    return <div className="result">{loadingMessage}</div>;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="result">
      <MetadataList data={data} />
      {data.preview?.image && (
        <img
          className="preview-image"
          src={data.preview.image}
          alt={`Preview of ${data.name}`}
        />
      )}
      {data.preview?.text && <pre className="preview-text">{data.preview.text}</pre>}
    </div>
  );
}
