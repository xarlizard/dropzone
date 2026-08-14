const zone = document.getElementById('zone');
const fileInput = document.getElementById('file-input');
const result = document.getElementById('result');

zone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) uploadFile(file);
});

['dragenter', 'dragover'].forEach((eventName) => {
  zone.addEventListener(eventName, (event) => {
    event.preventDefault();
    zone.classList.add('dragover');
  });
});

['dragleave', 'drop'].forEach((eventName) => {
  zone.addEventListener(eventName, (event) => {
    event.preventDefault();
    zone.classList.remove('dragover');
  });
});

zone.addEventListener('drop', (event) => {
  const file = event.dataTransfer.files[0];
  if (file) uploadFile(file);
});

function formatKind(kind) {
  const labels = {
    text: 'Text',
    image: 'Image',
    pdf: 'PDF',
    zip: 'ZIP',
  };
  return labels[kind] ?? kind;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function addMetadataRow(container, label, value) {
  const dt = document.createElement('dt');
  dt.textContent = label;

  const dd = document.createElement('dd');
  dd.textContent = value ?? '—';

  container.appendChild(dt);
  container.appendChild(dd);
}

function renderResult(data) {
  result.replaceChildren();
  result.style.display = 'block';

  if (data.error) {
    result.className = 'error';
    result.textContent = data.error;
    return;
  }

  result.className = '';

  const metadata = document.createElement('dl');
  metadata.className = 'metadata';

  addMetadataRow(metadata, 'Name', data.name);
  addMetadataRow(metadata, 'Declared type', data.declared_type);
  addMetadataRow(metadata, 'Detected type', data.detected_type);
  addMetadataRow(metadata, 'Detected extension', data.detected_ext);
  addMetadataRow(metadata, 'Size', formatBytes(data.size));
  addMetadataRow(metadata, 'Kind', formatKind(data.kind));

  for (const [key, value] of Object.entries(data.metadata ?? {})) {
    addMetadataRow(metadata, key.replaceAll('_', ' '), String(value));
  }

  result.appendChild(metadata);

  if (data.preview?.image) {
    const img = document.createElement('img');
    img.className = 'preview-image';
    img.src = data.preview.image;
    img.alt = `Preview of ${data.name}`;
    result.appendChild(img);
  }

  if (data.preview?.text) {
    const snippet = document.createElement('pre');
    snippet.className = 'preview-text';
    snippet.textContent = data.preview.text;
    result.appendChild(snippet);
  }
}

async function uploadFile(file) {
  result.style.display = 'block';
  result.className = '';
  result.textContent = `Uploading ${file.name}...`;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();

    if (!response.ok) {
      renderResult({ error: data.error ?? 'Upload failed.' });
      return;
    }

    renderResult(data);
  } catch (err) {
    renderResult({ error: `Upload failed: ${err.message}` });
  }
}
