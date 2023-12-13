---
title: Getting Started
---

This repo is set up as a GitHub Template, making it easy to spin up your own copy. Navigate to the [@undone-labs/docs-starter repo](https://github.com/undone-labs/docs-starter) and click on "Use this template". Once you're up and running, you'll need to do a few things to get started:

### Base setup

```bash
git clone <your_repo_url>
cd docs-starter
npm ci
```

### Self-signed certificate

In order to use the site in local development mode, two files must be added to the repo's root directory. The following set of commands apply to a MacOS system, however, if mkcert is installed by another package manager, this can be run on any flavor of \*nix.

```bash
cd ~/.ssh
brew install mkcert # replace with another package manager for linux distro
brew install nss # need to install certutil before running `mkcert -install` so the CA can be automatically installed in Firefox
# at this point, open any https website in Firefox before running the below commands
mkcert -install
mkcert -key-file localhost_key.pem -cert-file localhost_cert.pem localhost 127.0.0.1
cat localhost_cert.pem > localhost_fullchain.pem
cat "$(mkcert -CAROOT)/rootCA.pem" >> localhost_fullchain.pem
```

Now, navigate to your project directory, wherever the repo was cloned to, for example cd `~/Sites/work/website` and copy the pem files into the repo root. These keys are .gitignored by default.

```bash
cp -v ~/.ssh/localhost_cert.pem ~/.ssh/localhost_key.pem .
```

### `.env` file

Place the following `.env` file into the root of your repo. This file is .gitignored.

```bash
# ---------------------------------------------------------------------- General
NODE_ENV=development
SERVER_ENV=development
# ---------------------------------------------------------------------- Algolia
ALGOLIA_APPLICATION_ID=<application_id>
ALGOLIA_API_KEY=<api_key>
ALGOLIA_INDEX_ID=<index_id>
```

For more information about the Algolia env variables, read the [Algolia docs](@TODO)

### Run in local development mode

```bash
npm run dev
```

### Run in production mode
<!-- # @TODO -->
