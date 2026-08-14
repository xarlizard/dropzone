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

# Production Ready comments

The project has moved from the original Express + plain JSX setup into a production-oriented stack:

- **React (TypeScript)** — the client lives under `src/app/` as a Vite-built SPA with typed components, hooks, and Tailwind/shadcn-style UI. Upload results open in a modal; metadata for the latest 10 uploads is kept in memory (previews are ephemeral and never stored).
- **Hono on Cloudflare Workers** — the API lives under `src/api-server/` as a Hono app deployed as a Worker. Routes cover `GET /health` and `POST /api/upload`. Wrangler serves the built SPA as static assets while API paths run on the Worker first.
- **Shared TypeScript types** — `src/types/` defines contracts such as `UploadResponse` and `FileKind`, imported by both the React app (`@shared/types/*`) and the Worker (`@shared/types/*`) so the upload response shape stays in sync.
- **Shared utilities** — `src/utils/` holds file classification, preview generation, and formatters used by the Worker upload handler and, where relevant, the React UI (`@shared/utils/*`). Image previews use `@jsquash` WASM codecs instead of Node-only libraries, so the same logic runs in the Worker runtime.
- **Single toolchain** — Vite + `@cloudflare/vite-plugin` handles local dev, client build, and Worker bundling. Path aliases in `vite.config.ts` and `tsconfig.json` wire `@/`, `@shared/*`, and `@api-server/*` together.

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
├── vite.config.ts          # React client + Cloudflare Worker (Hono) build
├── wrangler.toml           # Worker entry, SPA assets, route rules
├── tsconfig.json           # App/worker TypeScript + path aliases
├── tsconfig.node.json      # Vite config TypeScript
├── components.json         # shadcn/ui configuration
├── postcss.config.js       # Tailwind PostCSS setup
├── src/
│   ├── api-server/         # Hono API (Cloudflare Worker)
│   │   ├── index.ts        # App entry, middleware, route mounting
│   │   ├── middleware/     # CORS, error handling
│   │   ├── routes/
│   │   │   ├── health.ts   # GET /health
│   │   │   └── upload.ts   # POST /api/upload
│   │   └── uploadHandler.ts# Classify file, build preview, respond
│   ├── app/                # React SPA (TypeScript)
│   │   ├── main.tsx        # Client entry
│   │   ├── App.tsx         # Page layout, upload flow, history
│   │   ├── api/
│   │   │   ├── health.ts   # Client health helper
│   │   │   └── uploadClient.ts # Browser upload fetch helper
│   │   ├── components/
│   │   │   ├── Dropzone.tsx
│   │   │   ├── MetadataList.tsx
│   │   │   ├── UploadMetadataDialog.tsx
│   │   │   ├── UploadHistoryList.tsx
│   │   │   └── ui/         # Shared UI primitives (button, card, …)
│   │   ├── hooks/          # API health, upload history
│   │   ├── layout/         # App header and shell
│   │   ├── lib/            # Client-only helpers
│   │   ├── styles/         # Global CSS (Tailwind)
│   │   └── types/          # Client-only UI types
│   ├── types/              # Shared types (client + worker)
│   │   └── upload.ts       # UploadResponse, FileKind, error shape
│   └── utils/              # Shared utilities (client + worker)
│       ├── fileClassifier.ts
│       ├── imagePreview.ts # Thumbnail via @jsquash (Worker-safe)
│       ├── imageCodecs.ts  # WASM codec init for PNG/JPEG
│       ├── textPreview.ts
│       ├── formatBytes.ts
│       ├── formatKind.ts
│       └── supportedFormats.ts
└── dist/                   # Build output (gitignored)
    ├── client/             # Vite-built React SPA
    └── dropzone/           # Worker bundle + WASM assets
```

## Getting started

**Prerequisites:** Node.js 20+

```bash
npm install
```

### Development

Runs Vite with the Cloudflare plugin: React SPA and Hono Worker API together on one dev server.

```bash
npm run dev
```

Open **http://localhost:5173**.

### Production build

```bash
npm run build
npm run preview   # local preview of the production build
```

### Deploy

```bash
npm run deploy    # build + wrangler deploy
```

### Typecheck

```bash
npm run typecheck
```

## Architecture

- **Client** (`src/app/`) — React + TypeScript SPA built with Vite and Tailwind. The dropzone POSTs files to `/api/upload`; successful uploads open a metadata/preview dialog. Metadata for the last 10 uploads is kept in memory; previews exist only until the dialog is closed.
- **Worker API** (`src/api-server/`) — Hono app compiled for Cloudflare Workers. Handles health checks and upload processing. Static assets from the React build are served via Wrangler `[assets]`, with `/api/*` and `/health` routed to the Worker first.
- **Shared layer** (`src/types/`, `src/utils/`) — Types and processing logic shared across client and Worker through `@shared/types/*` and `@shared/utils/*` aliases, keeping the upload contract and file handling consistent on both sides.
