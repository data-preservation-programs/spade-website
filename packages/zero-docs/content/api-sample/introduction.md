---
title: Introduction
---

For documentation that touches on things like API endpoints, the Docs Starter comes with some built-in patterns and components that make it easy to outline headers, query parameters, JSON responses and more. You can see an example of an API Preview component on this page, to the right. The component is positioned sticky so that it follows you along the page as you scroll up and down and peruse the API Information.

### Directory Setup

API information is defined in a JSON file inside the content directory. Take this example directory:

```
api-sample
  cats
    get-cats.md
    get-cats.json
    post-cats.md
    post-cats.json
```

We can see that there's a mixture of `.md` and `.json` files of the same name. JSON files that are named the same as their markdown counterparts will automatically be included on the page (or [section](/the-docs-directory/writing-content#multiple-sections-on-one-page), if it's a double-nested directory) _directly below the markdown content_. A live example can be seen [here](/api-sample/cats).

### JSON Structure

The JSON (example in the preview seen to the right) is strict and contains keywords that are important to include as they define what is visible on the webpage. Most act as conditionals, by their very inclusion or exclusion. Here's what a sample schema looks like:

```json
{
  "headers": { // optional
    "_section_heading": "", // optional
    "key": { // at least 1 required
      "type": "", // optional
      "description": "" // optional
    },
    ...
  },
  "query_parameters": { // optional
    // same as "headers" key
  },
  "response_codes": { // optional
    "200": "OK" // at least 1 required
  },
  "sliders": [ // optional, can be an empty array []
    {
      "metadata": { // optional
        "tag": "", // optional
        "title": "" // optional
      },
      "slides": [ // required
        {
          "language": "", // required
          "tab": "", // required
          "content": "" // required
        },
        ...
      ]
    },
    ...
  ]
}
```

Inclusion of any of the `headers`, `query_parameters`, `response_codes` and `sliders` is optional. The following headings are generated on the frontend:

- `headers`: "Headers"
- `query_parameters`: "Query Parameters"
- `response_codes`: "HTTP Response Status Codes"

These headings can be overriden with a special `_section_heading` key. If omitted, then the default heading(s) outlined above will be used.

For sliders, the `metadata` key defines the tag and title. The tag is highlighted and the order of what comes first, tag or title, can be controlled by switching the order in the JSON.
