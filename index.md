---
okf_version: "0.2"
---

# Overview

* [README](README.md) - Challenge notes, production stack summary, supported file types, project structure, and run instructions.

# Source

* [src](src/index.md) - Application source root.

## Worker API (`src/api-server`)

* [index.md](src/api-server/index.md) - Hono Worker routes and upload processing.
* [index.ts](src/api-server/index.ts) - App entry; mounts middleware, `/health`, and `/api`.
* [middleware/index.ts](src/api-server/middleware/index.ts) - CORS and global error handling.
* [routes/health.ts](src/api-server/routes/health.ts) - `GET /health`.
* [routes/upload.ts](src/api-server/routes/upload.ts) - `POST /api/upload`.
* [uploadHandler.ts](src/api-server/uploadHandler.ts) - Classify file, build preview, respond.

## React app (`src/app`)

* [index.md](src/app/index.md) - Client entry, layout, components, hooks, and client-only types.
* [main.tsx](src/app/main.tsx) - Client bootstrap and theme/toast providers.
* [App.tsx](src/app/App.tsx) - Page shell, upload flow, metadata dialog, and history.
* [components/Dropzone.tsx](src/app/components/Dropzone.tsx) - Drag-and-drop upload zone.
* [components/UploadMetadataDialog.tsx](src/app/components/UploadMetadataDialog.tsx) - Modal for metadata and ephemeral previews.
* [components/UploadHistoryList.tsx](src/app/components/UploadHistoryList.tsx) - In-memory list of the latest 10 uploads.
* [components/MetadataList.tsx](src/app/components/MetadataList.tsx) - Metadata definition list.
* [layout/](src/app/layout/) - App header with theme toggle and API health indicator.

## Shared

* [types/index.md](src/types/index.md) - Shared API contracts and Worker env types.
* [types/upload.ts](src/types/upload.ts) - `UploadResponse`, `FileKind`, and upload error shape.
* [utils/index.md](src/utils/index.md) - Classifier, previews, formatters used by Worker and UI.

# Configuration

* [package.json](package.json) - Dependencies and scripts.
* [vite.config.ts](vite.config.ts) - React + Cloudflare Vite plugin and path aliases.
* [wrangler.toml](wrangler.toml) - Worker entry, SPA assets, and route rules.
* [tsconfig.json](tsconfig.json) - TypeScript paths (`@/`, `@shared/*`, `@api-server/*`).
* [components.json](components.json) - shadcn/ui configuration.
* [.gitignore](.gitignore) - Ignored build output, Wrangler state, secrets, and local caches.
