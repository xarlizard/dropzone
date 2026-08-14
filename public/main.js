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

async function uploadFile(file) {
  result.style.display = 'block';
  result.textContent = `Uploading ${file.name}...`;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();

    // TODO: this just dumps the raw response.
    // Once the backend returns real metadata/preview data, render it properly
    // (an actual thumbnail for images, a text snippet for text files, etc.)
    result.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    result.textContent = `Upload failed: ${err.message}`;
  }
}
