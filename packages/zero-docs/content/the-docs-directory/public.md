---
title: The Public Directory
---

### Directory setup

In the top-level `docs` directory, create a `docs/public` subdirectory. The name is strict. The dev server will watch this directory for changes and auto-restart when they are detected. All filetypes are supported.

❗️ Files placed into this directory will become _publicly accessible_, nested under a `/public/<filename>` URL

For the most part, this directory will be used to contain image assets that are used in markdown content. The open graph image as well as the favicon should be placed here as well.

#### Favicon

The Docs Starter supports a light and dark favicon. If the browser is in dark mode, the light favicon is loaded and if the browser is in light mode, the dark favicon is loaded.

The favicon can be generated at [https://www.favicon-generator.org/](https://www.favicon-generator.org/). Note that if your favicon has transparency (is a PNG), then it _must_ be a perfect square for [favicon-generator.org](https://www.favicon-generator.org/) to generate it correctly. Otherwise the transparency is lost.

Once generated, the favicons must be placed into one of two directories: `light` and `dark`. These names are strict.

Each directory must contain a `browserconfig.xml` ([sample](https://github.com/undone-labs/docs-starter/blob/main/packages/src/docs-base/public/favicon/light/browserconfig.xml)) and a `manifest.json` ([sample](https://github.com/undone-labs/docs-starter/blob/main/packages/src/docs-base/public/favicon/light/manifest.json)). It is strongly advised that the samples are copied and then modified where necessary since they contain hardcoded directory paths that are required for the favicons to load correctly.

As well, the global favicon paths are defined in the `nuxt.config.js` and in the `default.vue` layout. These never need to be updated as long as the favicon directory structure is not modified from the base default.
