import { formatBytes } from '../utils/formatBytes';
import { formatKind } from '../utils/formatKind';

function MetadataRow({ label, value }) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{value ?? '—'}</dd>
    </>
  );
}

export function MetadataList({ data }) {
  return (
    <dl className="metadata">
      <MetadataRow label="Name" value={data.name} />
      <MetadataRow label="Declared type" value={data.declared_type} />
      <MetadataRow label="Detected type" value={data.detected_type} />
      <MetadataRow label="Detected extension" value={data.detected_ext} />
      <MetadataRow label="Size" value={formatBytes(data.size)} />
      <MetadataRow label="Kind" value={formatKind(data.kind)} />
      {Object.entries(data.metadata ?? {}).map(([key, value]) => (
        <MetadataRow key={key} label={key.replaceAll('_', ' ')} value={String(value)} />
      ))}
    </dl>
  );
}
