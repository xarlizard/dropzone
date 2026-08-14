import express from 'express';
import multer from 'multer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.static(path.join(__dirname, '..', 'public')));

app.post('/api/upload', upload.single('file'), async (req, res) => {
  const file = req.file;

  if (!file) {
    res.status(400).json({ error: 'No file uploaded.' });
    return;
  }

  // Starter behavior: just echo back what the browser claims about the file.
  //
  // TODO: inspect the actual file contents rather than trusting these values.
  // TODO: branch the response based on what the file actually is.
  // TODO: build a preview appropriate to the file type (thumbnail, snippet, ...).
  // TODO: make sure one bad/corrupt file can't take down the whole request.
  res.json({
    declared_name: file.originalname,
    declared_type: file.mimetype,
    size: file.size,
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Dropzone exercise running at http://localhost:${PORT}`);
});
