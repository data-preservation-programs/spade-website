---
title: Writing Content
---

### Directory setup

In the top-level `docs` directory, create a `docs/content` subdirectory. The name is strict. Once created the `@nuxt/content` module will load all the appropriate files and the dev server will watch this directory for changes and auto-restart when they are detected. The following filetypes are supported: `.md`, `.vue` and `.json`.

### Directory structure

The `docs/content` directory follows an opinionated structure and this structure is used to generate permalinks site-wide, as well as in the sitemap. Here's what the directory structure could look like if using the full suite of features:

```
docs/content
  subdirectory-single-nesting
    introduction.md
    getting-started.md
  subdirectory-multiple-sections-on-one-page
    group-of-cat-sections
      cats-are-great.md
      cats-dont-care.md
    group-of-dog-sections
      docs-love-people.md
      dogs-like-walks.md
  subdirectory-double-nested-with-api-preview
    cat-api-endpoint-list
      get-cats.md
      get-cats.json
      post-cats.md
      post-cats.json
  subdirectory-component-preview
    fancy-component.md
    fancy-component.vue

```

As well, all content must live in a subdirectory. For example, `docs/content/welcome`. `docs/content/welcome.md` (a file in the root) is not allowed.

💡 File slugs (ex: `subdirectory-single-nesting`) are converted into `Proper Case` and used to generate page headings. In this case, the heading would be `Subdirectory Single Nesting`.

❗️ Only 2 levels of directory nesting is supported. If 3 levels are detected, the build script will throw an error and the site will not generate correctly.

#### Single-nesting

```
subdirectory-single-nesting
  introduction.md
  getting-started.md
```

This is the simplest path to getting started. Just throw some markdown files into a subdirectory and you're good to go.

#### Multiple sections on one page

```
subdirectory-multiple-sections-on-one-page
  group-of-cat-sections
    cats-are-great.md
    cats-dont-care.md
    src.md
  if-cats-why-not-dogs
    docs-love-people.md
    dogs-like-walks.md
    src.md
```

In cases where it's useful to split a page into multiple sections (delineated automatically by an `<hr>`-like line break), you can nest files in a second subdirectory. The example above results in 2 pages being created, each with 2 sections:

- /subdirectory-multiple-sections-on-one-page/group-of-cat-sections
- /subdirectory-multiple-sections-on-one-page/if-cats-why-not-dogs

In order to add SEO information for pages that are created via double-nesting, the addition of a separate markdown filed named `src.md` is required inside the double-nested directory. The only thing this file is used for is to edit SEO via its [frontmatter](@TODO). Any content placed in this file is ignored.

💡 In this case, the double-nested _directory_ slug is converted to `Proper Case` and used to generate the page heading

#### API preview

Outlined [here](/api-sample/introduction)

#### Component preview

Outlined [here](/content-sample/preview-a-component)
