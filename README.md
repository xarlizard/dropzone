# Dropzone 

## Challenge

Build a small file processing pipeline. When someone drops a file onto the page, report back
its metadata, and render a preview: a thumbnail for images, a short snippet for text files, and
just the metadata for anything else.

# Interview final handwritten comment

This app is a dropzone for drag and dropping files.

It supports `images` (jpeg/png), `text` (text/json), `PDF` and `Zip` files. All unsupported file types are properly displayed as invalid for the upload.

It displays metadata for all file types, and for supported we render a preview (thumbnail for images and text snippet for text files).

Futureproofing this project would require to add to the main try/catch for the upload process a way for detecting broken images, currently `"myimage.png"` metadata seems corrupted/broken.

More QA and failsafes are required, and custom messages for UX like "This image is broken" or similar.

# PROJECT STANDARD README following @open/templates structure (my personal strucure)

For agent-friendly navigation of this repository, see [index.md](index.md) (Open Knowledge Format).

## Supported file types

| Kind   | Extensions / MIME                         | Preview        |
|--------|-------------------------------------------|----------------|
| Image  | PNG, JPEG                                 | 200×200 thumbnail |
| Text   | `.txt`, `.json`                           | First 500 characters |
| PDF    | `.pdf`                                    | Metadata only  |
| ZIP    | `.zip`                                    | Metadata only  |

Unsupported types return a `415` response with a clear error message.

## Project structure

```
dropzone/
├── index.html              # Vite HTML shell
├── index.md                # OKF bundle root (progressive disclosure)
├── vite.config.js          # Client build + dev proxy to /api
├── src/
│   ├── App.jsx             # React client entry
│   ├── App.css             # Client styles
│   ├── AppServer.ts        # Express server entry
│   ├── api/
│   │   ├── uploadClient.ts # Browser upload fetch helper
│   │   ├── uploadHandler.ts# Upload processing logic
│   │   └── uploadRoute.ts  # Express route wiring
│   ├── components/
│   │   ├── Dropzone.jsx    # Drag-and-drop zone + file picker
│   │   ├── MetadataList.jsx# Metadata definition list
│   │   └── UploadResult.jsx# Result / error / loading display
│   ├── types/
│   │   └── upload.ts       # Shared UploadResponse and FileKind types
│   └── utils/
│       ├── constants.ts    # MIME sets and snippet length
│       ├── extension.ts    # Filename extension helper
│       ├── fileClassifier.ts
│       ├── formatBytes.ts  # Shared byte formatter (client + server)
│       ├── formatKind.ts
│       ├── imagePreview.ts # Sharp thumbnail generation
│       └── textPreview.ts  # Text snippet extraction
└── dist/                   # Build output (gitignored)
    ├── AppServer.js        # Compiled server
    └── client/             # Vite-built React app
```

## Getting started

**Prerequisites:** Node.js 20+

```bash
npm install
```

### Development

Runs the API server on port `3000` and the Vite dev server on port `5173` (with `/api` proxied to the server).

```bash
npm run dev
```

Open **http://localhost:5173**.

### Production build

```bash
npm run build
npm start
```

Open **http://localhost:3000**.

## Architecture

- **Client** (`App.jsx`) — React app built with Vite. Components handle drag-and-drop, rendering, and call `uploadClient.ts` to POST files to `/api/upload`.
- **Server** (`AppServer.ts`) — Express serves the built client from `dist/client` and mounts the upload API. Processing logic lives in `api/` and `utils/`.
- **Shared types** — `types/upload.ts` defines the upload response contract used by both sides.
