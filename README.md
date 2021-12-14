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

### 🏃‍♀️ Run MeiliSearch

There are many easy ways to [download and run a MeiliSearch instance](https://docs.meilisearch.com/reference/features/installation.html#download-and-launch).

For example, if you use Docker:

```bash
docker pull getmeili/meilisearch:latest # Fetch the latest version of MeiliSearch image from Docker Hub
docker run -it --rm -p 7700:7700 getmeili/meilisearch:latest ./meilisearch --master-key=masterKey
```

### 🚀 Run Gatsby

If you already have a Gatsby app, run it:

```bash
gatsby develop
```

With your running Gatsby app you should have access to the following URLs:

- `http://localhost:8000/` where your website runs
- `http://localhost:8000/___graphql` where you can discover and build graphQL queries

If you don't have a Gatsby app yet, you can follow [this step-by-step tutorial from Gastby](https://www.gatsbyjs.com/docs/tutorial) in order to create one.

## 🎬 Getting started

Now that you have a running Gatsby app with `gatsby-plugin-meilisearch` installed and a running MeiliSearch instance, we can go to the next step and add the plugin's options inside your `gatsby-config.js` configuration file.

### ⚙️ Configure your plugin options

#### 🔑 Add your MeiliSearch credentials

First, you should add your MeiliSearch instance credentials:

```node
plugins: [
  {
    resolve: 'gatsby-plugin-meilisearch,
    options: {
      host: 'http://localhost:7700',
      apiKey: 'masterKey',
      indexes: [],
    },
  },
]
```

#### ☝️ Fill in the indexes field

Then, you should fill in the `indexes` array field with each index object containing the following information:

**indexUid**

Name of your MeiliSearch index. Note that if your index already exists, it will be deleted and recreated.

```bash
indexUid: 'my_index'
```

**query**

This is the graphQL query you want to be executed in order to retrieve your documents.

```bash
query: ``
```

**transformer**

Function that transforms the fetched data before sending it to MeiliSearch.

```bash
transformer: () => {}
```

To learn more about these options, see [indexes options](#indexes-)

After filling in those fields, your plugin configuration file should look like this:

```node
plugins: [
  {
    resolve: 'gatsby-plugin-meilisearch,
    options: {
      host: 'http://localhost:7700',
      apiKey: 'masterKey',
      indexes: [
        {
          indexUid: 'my_index',
          transformer: data =>
            data.allSitePage.edges.map(({ node }, index) => ({
              id: index,
              ...node,
            })),
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
]
```

### 🥁 Build your project

The `gatsby-plugin-meilisearch` fetches and sends your documents for indexation to MeiliSearch on build, using the graphQL queries provided in the `gatsby-config.js` file.

To start a build, simply run:

```bash
gatsby build
```

After the build, a message in your terminal should confirm that your content was successfully indexed:

```bash
success gatsby-plugin-meilisearch - x.xxxs - Documents added to MeiliSearch
```

### 🪄 Integrate search components

If you need tools to integrate a search experience on your app, we also have what you need:

- [docs-searchbar](https://github.com/meilisearch/docs-searchbar.js): a tool to display a searchbar on your website
- [meilisearch-react](https://github.com/meilisearch/meilisearch-react): a React UI library that lets you quickly build a search interface in your front-end application

## 🛼 Usage

In the gatsby-config.js file, the MeiliSearch plugin accepts the following options:

### `host` (required)

The `host` field is the address where your MeiliSearch instance is running. `gatsby-plugin-meilisearch` needs it in order to communicate with your MeiliSearch instance, and send your documents to it.

### `indexes` (required)

The `indexes` field in an array of objects, each of them representing an [index](https://docs.meilisearch.com/learn/core_concepts/indexes.html#indexes)

You can have one or multiple `index` objects, which can be useful if you want to index your content in separate indexes.

Each `index` object should contain the following fields:

`indexUid` (required)

This is the name of your MeiliSearch index. If you provide an index name that already exists, the index will be deleted and recreated.
You can [learn more about indexes](https://docs.meilisearch.com/learn/core_concepts/indexes.html) on our documentation.

`query` (required)

This is the graphQL query that will be executed in order to retrieve your documents.
Your query can be very specific depending on the plugins you're using. If you're not sure about your query, you can use the GraphiQL tool (http://localhost:8000/\_\_\_graphql) provided by Gatsby on development mode to help you build it.

You can also check [our playground's configuration file](playground/gatsby-config.js) to have an example of a graphQL query using the `gatsby-plugin-mdx` plugin.

`transformer` (required)

This is a function that transforms the fetched data before sending it to MeiliSearch.

After executing the graphQL query, a data object is received with a structure that can differ from one project to another, depending on the query you provided. Therefore, your data needs to be transformed in order to be indexed by MeiliSearch, which accepts an array of documents.
Moreover, each of your documents needs to have a `unique identifier`. If you couldn't retrieve one with your graphQL query, the `transformer` function is the correct place to add one.

If you want to learn more about MeiliSearch's documents structure, you can do so in [our documentation](https://docs.meilisearch.com/learn/core_concepts/documents.html#structure).

### `apiKey` (optional)

The `apiKey` field contains the API key if the MeiliSearch instance is password protected.

Example:

Set your API key in your `gatsby-config` file:

```node
options: {
  host: 'http://localhost:7700',
  apiKey: 'masterKey',
  indexes: [
    {
      indexUid: 'my_index',
      transformer: () => {},
      query: ``
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
  skipIndexing: false,
  batchSize: 1000,
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
