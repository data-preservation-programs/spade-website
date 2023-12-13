---
title: Theming
---

### Directory setup

In the top-level `docs` directory, create a `docs/theme` subdirectory. The name is strict. The theme files are auto-loaded and the dev server will watch this directory for changes and auto-restart when they are detected. The following filetypes are supported: `.scss`. The best course of action when updating the theme would be to copy the base theme from `src/assets/scss/zero` into `docs/theme` and then to modify the required CSS selectors. While not required, it would be best to discard any CSS that was not modified in order to avoid duplicate CSS declarations both aiming to achieve the same thing.

### Directory structure

There are 3 files that must be included, even if they are left empty:

- `docs/theme/theme.scss`
- `docs/theme/typography.scss`
- `docs/theme/utilities.scss`

#### `docs/theme/theme.scss`

This is the primary theme entry file, from which you can import SCSS partials and other SCSS files. The theme directory can be structured in any way and can contain any number of nested subdirectories, as many levels as is necessary to keep things organized. Really high-level declarations (such as `body {}`) or declarations that are too small to pull out into a separate file can be placed here.

#### `docs/theme/typography.scss`

Font imports, mixins and typography-related declarations can be put here.

#### `docs/theme/utilities.scss` & dark/light mode themeing

Here we can define or modify SCSS variables, general mixins and site-wide utilities.

❗️ This file should NOT contain any styling (classes or IDs). It should only contain variables, functions, mixins, etc.
