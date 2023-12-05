---
title: Components
---

### Directory setup

In the top-level `docs` directory, create a `docs/components` subdirectory. The name is strict. The components are auto-loaded and the dev server will watch this directory for changes and auto-restart when they are detected. The following filetypes are supported: `.vue`. This directory contains components used in the UI. It is not a general components directory for modifications. Its utility is limited to 2 functions:

#### Directory sidebar icons

The [data](/the-docs-directory/data) directory contains `sidebar.json`, which is used to define the sidebar navigation entries. The entries contain an `icon` key, which takes a slug. If a component that contains an icon as an SVG is placed inside the components directory and is named the same as the matching `icon` key, it will be displayed in the sidebar beside the major section heading. It is advised to follow slug naming conventions by titling the component filename in `kebab-case`. For example, place a component named `the-docs-directory.vue` into  `docs/components`, and then define it in `sidebar.json` like so:

```json
{
  "title": "The Docs Directory",
  "slug": "the-docs-directory",
  "icon": "the-docs-directory",
  "children": []
},
...
```

#### Site logo

If a component named `site-logo.vue` (filename is strict) is placed in the `docs/components` directory, it will be auto-loaded into the site header, replacing the placeholder Docs Starter logo with the desired one.
