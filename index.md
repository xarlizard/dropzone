---
okf_version: "0.2"
---

# Overview

* [README](README.md) - Project overview, setup commands, supported file types, and directory layout.

# Source

* [src](src/index.md) - Application source root.

## App (client)

* [App.jsx](src/App.jsx) - React client entry, app shell, and mount point.
* [App.css](src/App.css) - Global client styles for the dropzone UI.

## Server

* [AppServer.ts](src/AppServer.ts) - Express server entry; serves the built client and mounts `/api`.

## API

* [api](src/api/index.md) - Upload route, handler, and browser fetch client.
* [uploadRoute.ts](src/api/uploadRoute.ts) - Express router; wires `POST /upload` with multer.
* [uploadHandler.ts](src/api/uploadHandler.ts) - Classifies files, builds previews, returns JSON.
* [uploadClient.ts](src/api/uploadClient.ts) - Browser `fetch` helper for `/api/upload`.

## Components

* [components](src/components/index.md) - React UI layer.
* [Dropzone.jsx](src/components/Dropzone.jsx) - Drag-and-drop zone, file picker, and upload state.
* [UploadResult.jsx](src/components/UploadResult.jsx) - Loading, error, metadata, and preview display.
* [MetadataList.jsx](src/components/MetadataList.jsx) - Definition list for file metadata fields.

## Types

* [types](src/types/index.md) - Shared TypeScript contracts.
* [upload.ts](src/types/upload.ts) - `FileKind`, `UploadResponse`, and `UploadErrorResponse`.

## Utils

* [utils](src/utils/index.md) - Shared and server-side helpers.
* [constants.ts](src/utils/constants.ts) - MIME type sets and snippet length.
* [extension.ts](src/utils/extension.ts) - Filename extension helper.
* [fileClassifier.ts](src/utils/fileClassifier.ts) - Detects file kind from buffer and declared type.
* [formatBytes.ts](src/utils/formatBytes.ts) - Human-readable byte formatter (client + server).
* [formatKind.ts](src/utils/formatKind.ts) - Maps `FileKind` values to display labels.
* [imagePreview.ts](src/utils/imagePreview.ts) - Sharp thumbnail generation and image metadata.
* [textPreview.ts](src/utils/textPreview.ts) - Text snippet extraction and line/character counts.

# Configuration

* [package.json](package.json) - Dependencies and npm scripts.
* [vite.config.js](vite.config.js) - Vite build output and dev-server API proxy.
* [tsconfig.json](tsconfig.json) - TypeScript compiler options for server-side code.
