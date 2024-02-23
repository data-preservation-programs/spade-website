# Fern

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

Websites for Spade, including the main site and the documentation site.


## Overview

This project is structured as an NPM monorepo, and can be used to implement a backend, application UI, static microsite, or anything else.

Typically used workspaces in the monorepo are as follows:

- `site`, `website` or `client` - General Nuxt3 frontend (universal or static site modes)
- `docs` - Documentation site
- `backend` - Backend


## Stack

- Requires NodeJS and has been tested on node 20 (node 20+ required)
- Uses a Vue framework, [NuxtJS 3](https://nuxtjs.org/)
- Styles are written in SCSS, and are concatenated and tree-shaken during compile-time


## Static site

- The `site` workspace can be compiled into a static site, which can then be served as a static resource
- To avoid issues with hoisting npm packages, the site should be run by first navigating to `cd packages/site`
- This site can be hosted on any resource supporting static files, but may include some services that require a serverless node
- The site itself is served statically, but internal navigation is virtualized in the browser: in other words, the site acts as an SPA when browsed on the client


## Local development

To use either workspace, you'll need to create a self-signed certificate (see below) and copy it into the repo.


### Generate a self-signed certificate

In order to browse with TLS locally, you'll need a certificate. A self-signed certificate is satisfactory for this purpose. Here's how to set one up.

Used for development in a local environment (such as on your personal computer). You only need to do this once. If you've already done this for a different project, just copy your existing `localhost_cert.pem` and `localhost_key.pem` files from `~/.ssh` into the root directory of this repo and skip the rest of this step.

- [Install mkcert and generate certificate](https://github.com/FiloSottile/mkcert) by running the commands below, in this order:
  ```zsh
  cd ~/.ssh
  brew install mkcert # replace with another package manager for linux distro
  brew install nss # need to install certutil before running `mkcert -install` so the CA can be automatically installed in Firefox

  # at this point, open any https website in Firefox before running the below commands

  mkcert -install
  mkcert -key-file localhost_key.pem -cert-file localhost_cert.pem localhost 127.0.0.1
  cat localhost_cert.pem > localhost_fullchain.pem
  cat "$(mkcert -CAROOT)/rootCA.pem" >> localhost_fullchain.pem
  ```
- Copy the new `localhost_cert.pem` and `localhost_key.pem` files to the root directory of this repo

The above tutorial is specifically for MacOS machines with `brew` installed. For other \*nix OS's replace the installation step with your preferred package manager (e.g. `apt install mkcert`).


### Environment variables

Add the following `.env` file to the repo root

```ini
NODE_ENV=development
SERVER_ENV=development

ALGOLIA_APPLICATION_ID=unset
ALGOLIA_API_KEY=unset
ALGOLIA_INDEX_ID=unset
```

Even if Algolia is not currently in use, these keys still need to be specified.
For production deployment, both the `NODE_ENV` and `SERVER_ENV` should be set to `production`.


### App frontend
To build the frontend:
- Clone this repo
- Make sure Node.js 20 or newer is installed
  - A version 1 or 2 lockfile will not be compatible with this site, so NPM v7 or higher must be used
- Make sure your `.env` file is set up
- Configure a self-signed certificate for local HTTPS support (see section below)
- Install npm dependencies by running `npm ci`
- Run `npm run dev-site` from the repo root to initiate local development
- In production, run `npm run build-site` first, and then run `npm run start-site` to initiate the production instance of the application (`pm2` can optionally be used to persist this process)
- In either case, the app will let you know which port it's running in the shell's stdout


### Static site
To build this static site site:
- Clone this repo
- Make sure Node.js 20 or newer is installed
  - A version 1 or 2 lockfile will not be compatible with this site, so NPM v7 or higher must be used
- Configure a self-signed certificate for local HTTPS support (see next section)
- Install NPM dependencies by running `npm ci`
- Then, either generate the static site, or run it in local development mode:
  - To build the static site
    - Run `npm run generate-site`
    - A directory `.output/public` will be created, which contains the static site output
  - To run in local development mode, for features like hot reload:
    - Run `npm run dev`
    - The site will be available in real time via a localhost URL


## Content

Frontend content is abstracted to a variety of key `json` files. Currently, the best approach to change content is to clone this repo or edit values in Github. In the future, these json files can be coupled with a headless CMS (ideally one that commits directly into Github and retains the current workflow).

The following is a (non-exhaustive) list of sample key files where content may be found

- `packages/site/data/`
- `packages/site/content/`

It's important to maintain abstraction of content, so anything that's content related should be added to json or markdown files, and never within components or other application code files.


## Updating dependencies

Please use `npm ci` in place of `npm i` when not explicitly upgrading dependencies. `npm ci` will only install versions of packages provided in the lockfile, leading to more stability.

Always regression test the site if upgrading packages, as they may contain breaking changes.


## Commit Messages

Commit messages should use the [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/) format. `commitlint` has been installed to validate this usage. This means that all commits should be prefixed appropriately with a tag denoting the kind of code being committed.

- `feat:` A feature, or part of a feature
- `fix:` A bug fix
- `style:` A visual or stylistic change only
- `chore:` An operational task, such as routine maintenance, version control related operations, dependencies, etc.
- `refactor:` A change to the way the code is implemented, without materially changing the feature
- `perf:` A change that is made primarily to improve performance
- `test:` Any changes required to run a specific test or try out a behavior for the purposes of testing
- `cleanup:` Markup and syntactic cleanup that doesn't affect the code output
- `docs:` Documentation-related changes
- `content:` Changes to the project's content, such as copy or media


## Style guide

1. All file names will be in `kebab-case`
2. All component names on import will be `PascalCase`
3. The grid used is a flexbox style system called [Gridlex](https://gridlex.devlint.fr/), its documentation is also available as a [readme in this repo](packages/site/assets/scss/grid/README.md)
4. Color name variables in `SCSS` are obtained from [this resource](https://chir.ag/projects/name-that-color/)


## [Release Please](https://github.com/googleapis/release-please)

- Release Please automates CHANGELOG generation, the creation of GitHub releases, and version bumps for your projects. 
- It is currently setup as a github action in this repo
- See [documentation](https://github.com/googleapis/release-please) on how to use


## Initializing Docker container
_(optional)_

 A Docker container configuration is provided for the website. To use it, follow the steps below.

- Download and install Docker CLI
- Navigate to the website `cd packages/site`
- Run the build command `docker build -t site .`
- Finally, initialize the container `docker run -v "$PWD":/workspace site`
- The `Dockerfile` itself contains some options (commented out) for serving the repo on a local port, after generation
