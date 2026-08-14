import { Router } from 'express';
import multer from 'multer';
import { handleUpload } from './uploadHandler.js';

const upload = multer({ storage: multer.memoryStorage() });

export const uploadRouter = Router();

uploadRouter.post('/upload', upload.single('file'), handleUpload);
