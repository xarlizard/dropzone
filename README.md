# Dropzone

Build a small file processing pipeline. When someone drops a file onto the page, report back
its metadata, and render a preview: a thumbnail for images, a short snippet for text files, and
just the metadata for anything else.

# Completion

This app is a dropzone for drag and dropping files.

It supports `images` (jpeg/png), `text` (text/json), `PDF` and `Zip` files. All unsupported file types are properly displayed as invalid for the upload.

It displays metadata for all file types, and for supported we render a preview (thumbnail for images and text snippet for text files).

Futureproofing this project would require to add to the main try/catch for the upload process a way for detecting broken images, currently `"myimage.png"` metadata seems corrupted/broken. 

More QA and failsafes are required, and custom messages for UX like "This image is broken" or similar.
