---
title: Sitemap
---

A sitemap is generated automatically, directly from the `docs/content` directory and is accessible at the following URL:

```
<base_url>/sitemap.xml
```

and can also be previewed in development mode:

```
https://localhost:10040/sitemap.xml
```

### Customization

Sitemap generation can be customized by editing the `sitemap` block in the `nuxt.config.js`. Here's the default:

```js
sitemap: {
  exclude: [
    '/', // do not remove
    '/docs' // do not remove
  ]
}
```

❗️ When editing, do not remove the existing block, only add to it

The sitemap is generated using the `nuxt-simple-sitemap` package and all customization documentation can be found [here](https://nuxtseo.com/sitemap/getting-started/installation)
