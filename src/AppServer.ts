import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { uploadRouter } from './api/uploadRoute.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.join(__dirname, '..', 'dist', 'client');

const app = express();

app.use('/api', uploadRouter);
app.use(express.static(clientDir));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    next();
    return;
  }

  res.sendFile(path.join(clientDir, 'index.html'));
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Dropzone exercise running at http://localhost:${PORT}`);
});
