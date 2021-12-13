<p align="center">
  <img src="https://res.cloudinary.com/meilisearch/image/upload/v1587402338/SDKs/meilisearch_gatsby.svg" alt="MeiliSearch Gatsby" width="200" height="200" />
</p>

<h1 align="center">Gatsby plugin MeiliSearch</h1>

<h4 align="center">
  <a href="https://github.com/meilisearch/MeiliSearch">MeiliSearch</a> |
  <a href="https://docs.meilisearch.com">Documentation</a> |
  <a href="https://slack.meilisearch.com">Slack</a> |
  <a href="https://www.meilisearch.com">Website</a> |
  <a href="https://docs.meilisearch.com/faq">FAQ</a>
</h4>

<p align="center">
  <a href="https://app.bors.tech/repositories/34942"><img src="https://bors.tech/images/badge_small.svg" alt="Bors enabled"></a>
  <a href="https://github.com/meilisearch/gatsby-plugin-meilisearch/actions"><img src="https://github.com/meilisearch/gatsby-plugin-meilisearch/workflows/Tests/badge.svg" alt="Tests"></a>
  <a href="https://github.com/meilisearch/gatsby-plugin-meilisearch/blob/main/LICENCE"><img src="https://img.shields.io/badge/license-MIT-informational" alt="License"></a>
</p>
<br/>

<p align="center" style="font-weight:bold;" >A plugin to index your Gatsby content to MeiliSearch based on graphQL queries</p>

<br/>

## Table of Contents

- [📖 Documentation](#-documentation)
- [🔧 Installation](#-installation)
- [🏃‍♀️ Run MeiliSearch](#-run-meilisearch)
- [🎬 Getting started](#-getting-started)
- [🛼 Usage](#-usage)
- [🤖 Compatibility with MeiliSearch and Gatsby](#-compatibility-with-meilisearch-and-gatsby)
- [⚙️ Development Workflow and Contributing](#-development-workflow-and-contributing)

## 📖 Documentation

To understand MeiliSearch and how it works, see the [MeiliSearch's documentation](https://docs.meilisearch.com/learn/what_is_meilisearch/).

To understand Gatsby and how it works, see [Gatsby's documentation](https://www.gatsbyjs.com/docs/tutorial/).

## 🔧 Installation

Inside your Gatsby app, add the package:

With `npm`:

```bash
npm install gatsby-plugin-meilisearch
```

With `yarn`:

```bash
yarn add gatsby-plugin-meilisearch
```

## 🏃‍♀️ Run MeiliSearch

There are many easy ways to [download and run a MeiliSearch instance](https://docs.meilisearch.com/reference/features/installation.html#download-and-launch).

For example, if you use Docker:

```bash
docker pull getmeili/meilisearch:latest # Fetch the latest version of MeiliSearch image from Docker Hub
docker run -it --rm -p 7700:7700 getmeili/meilisearch:latest ./meilisearch --master-key=masterKey
```

## 🎬 Getting started

**Creation of a Gastby project**

If you already have an existing Gatsby project, you can pass this stage and go to the next one.
To create a new Gastby project, simply run this command:

`gastby new`

Follow the steps, then go to the newly created repository and start Gastby:

`yarn develop` or `npm run develop`

You have now access to 2 URL:

- `http://localhost:8000/` where your website runs
- `http://localhost:8000/___graphql` where you can discover and build graphQL queries

**Installation of gatsby-plugin-meilisearch**

Add the plugin to your project's dependencies:

`yarn add gatsby-plugin-meilisearch` or `npm install gatsby-plugin-meilisearch`

Then you must add it to your `gatsby-config.js` configuration file:

```node
module.exports = {
  siteMetadata: {
    siteUrl: "https://www.yourdomain.tld",
    title: "The great Gatsby",
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-meilisearch,
      options: {
        host: 'http://localhost:7700',
        indexes: [
          {
            indexUid: 'the_great_gastby',
            transformer: data =>
              data.allSitePage.edges.map(({ node }, index) => ({
                id: index,
                ...node,
              })),
            query: `
            query MyQuery {
              allSitePage {
                edges {
                  node {
                    componentChunkName
                    internalComponentName
                    path
                  }
                }
              }
            }
            `,
          },
        ],
      },
    },
  ],
};
```

**Run a MeiliSearch instance**

If you already have a running MeiliSearch instance, you can replace the `host` field in the plugin option and add a new `apiKey` field with your MeiliSearch credentials.

I you don't, you can quickly start a new MeiliSearch instance by running the following commands:

```bash
docker pull getmeili/meilisearch:latest # Fetch the latest version of MeiliSearch image from Docker Hub
docker run -it --rm -p 7700:7700 getmeili/meilisearch:latest ./meilisearch
```

If you go to http://0.0.0.0:7700/, you should see our [mini-dashboard](https://github.com/meilisearch/mini-dashboard/) without any index nor documents inside. So let's fill it !

**Add your documents to MeiliSearch**

The `gatsby-plugin-meilisearch` fetches and sends your documents for indexation to MeiliSearch on build, thanks to your graphQL queries. You can try it by triggering a build of your website:

`yarn build` or `npm run build`

The build should succeed, and you should see an information telling you that your content was successfully indexed: `success gatsby-plugin-meilisearch - x.xxxs - Documents added to MeiliSearch`

Go back to http://0.0.0.0:7700/, the data you requested was fetched and indexed to MeiliSearch 🎉

If you need tools to integrate a search experience on your app, we also have what you need:

- [docs-searchbar](https://github.com/meilisearch/docs-searchbar.js): a tool to display a searchbar on your website
- [instant-meilisearch](https://github.com/meilisearch/instant-meilisearch): a UI library that lets you quickly build a search interface in your front-end application

## 🛼 Usage

### `host` (required)

The `host` field is the address where your MeiliSearch instance is running. `gatsby-plugin-meilisearch` needs it in order to communicate with your MeiliSearch instance, and send your documents to it.

### `indexes` (required)

The `indexes` field in an array of objects, each of them representing an [index](https://docs.meilisearch.com/learn/core_concepts/indexes.html#indexes)

You can have one or multiple `index` objects, which can be useful if you want to index your content in separate indexes.

Each `index` object should contain the following fields:

- `indexUid` (required): Name of your MeiliSearch index. Note that if your index already exists, it will be deleted and recreated
- `transformer` (required): function that transforms the fetched data before sending it to MeiliSearch
- `query` (required): the graphQL query you want to be executed in order to retrieve your documents

### `apiKey` (optional)

The `apiKey` field contains the API key if the MeiliSearch instance is password protected.

Example:

Start a MeiliSearch instance with an API key:
`docker run --rm -it -p 7700:7700 -e MEILI_MASTER_KEY=masterKey getmeili/meilisearch:latest`

Set your API key in your `gatsby-config` file:

```node
options: {
  host: 'http://localhost:7700',
  apiKey: 'masterKey',
  indexes: [
    {
      ...yourIndexOptions
    },
  ],
},
```

### `skipIndexing` (optional)

This option allows you to build your website without indexing to MeiliSearch. Default to false

### `batchSize` (optional)

The number of documents that should be included in each batch. Default to 1000

### `settings` (optional)

If you want to pass settings to your MeiliSearch instance, you can do it here.
[Read more about MeiliSearch settings](https://docs.meilisearch.com/reference/features/settings.html)

Example:

```node
{
  resolve: 'gatsby-plugin-meilisearch',
  options: {
    settings: {
      searchableAttributes: ['title'],
    },
  },
}
```

## 🤖 Compatibility with MeiliSearch and Gatsby

**Supported Gatsby versions**:

- Gastby v4.3.x

(This plugin may work with the older Gatsby versions, but these are not tested nor officially supported at this time.)

**Supported MeiliSearch versions**:

This package only guarantees the compatibility with the [version v0.24.0 of MeiliSearch](https://github.com/meilisearch/MeiliSearch/releases/tag/v0.24.0).

**Node / NPM versions**:

- NodeJS >= 14.15.X && <= 16.X
- NPM >= 6.x

**We recommend always using the latest version of Gatsby to start your new projects**.

## ⚙️ Development Workflow and Contributing

Any new contribution is more than welcome in this project!

If you want to know more about the development workflow or want to contribute, please visit our [contributing guidelines](/CONTRIBUTING.md) for detailed instructions!
