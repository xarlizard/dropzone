# API

* [uploadRoute.ts](uploadRoute.ts) - Express router; wires `POST /upload` with multer memory storage.
* [uploadHandler.ts](uploadHandler.ts) - Classifies uploaded files, builds previews, and returns JSON responses.
* [uploadClient.ts](uploadClient.ts) - Browser-side `fetch` helper that posts `FormData` to `/api/upload`.
