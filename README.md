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

With this command, your MeiliSearch instance `host` is `http://localhost:7700` and your master-key is `masterKey`

### 🚀 Run Gatsby

To use this plugin you need to have a Gatsby app. If you don't have one, you can either run the [playground present in this project)(./playground/README.md) or create a [Gatsby](https://www.gatsbyjs.com/docs/quick-start/) project.

Let's run your app:

```bash
gatsby develop
```

With your running Gatsby app you should have access to the following URLs:

- `http://localhost:8000/` URL of your web app.
- `http://localhost:8000/___graphql`: URL to the GraphiQL tool where you can build graphQL queries on the playground and request them.

If you don't have a Gatsby app yet, you can follow [this step-by-step tutorial from Gastby](https://www.gatsbyjs.com/docs/tutorial) in order to create one.

## 🎬 Getting started

Now you should have a running Gatsby app with `gatsby-plugin-meilisearch` installed and a running MeiliSearch instance.

Let's configure our plugin to make it work! In this example, we will fetch every page's URL of our Gatsby website, and index them to MeiliSearch.

All the plugin configuration happens inside your `gatsby-config.js` configuration file that should be at the root of your Gatsby project.

### ⚙️ Configure your plugin options

#### 🔑 Add your MeiliSearch credentials

First, you should add your MeiliSearch instance credentials!

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

See [this section](#-run-meilisearch) if you don't know what your credentials are.

#### ☝️ Fill in the indexes field

The next step is to configure the `indexes` field. This field is the heart of your plugin. It is where you describe what data you want to add in MeiliSearch and how.

The `indexes` field is an array that can be composed of multiple index objects. Each index object contains the following information:

**indexUid**

Name of the index in which the requested data is added. Note that if your index already exists, it will be deleted and recreated.
For the example of this getting started, let's create the `pages_url` index where we will store the URL of the default pages provided by a new Gatsby project.

```bash
indexUid: 'pages_url'
```

**query**

Then, we need to provide the graphQL query that retrieves the content of your pages.

```bash
query: `
  query MyQuery {
    allSitePage {
      nodes {
        path
      }
    }
  }
`,
```

After executing this query, we receive a `data` object matching the query:

```node
"data": {
  "allSitePage": {
    "nodes": [
      {
        "path": "/404/"
      },
      {
        "path": "/404.html"
      },
      {
        "path": "/"
      }
    ]
  }
}
```

**transformer**

Function that transforms the fetched data before sending it to MeiliSearch.

The format of the data retrieved with the previousy executed graphQL query is not compatible with the format expected by MeiliSearch. Therefore, it should be transformed to a compatible format with the help of the `transformer` function.

```bash
transformer: data =>
  data.allSitePage.nodes.map((node, index) => ({
    id: index,
    ...node,
  })),
```

In this function, we map on `data.allSitePage.nodes` in order to return an array of objects that can be indexed by MeiliSearch. We add an `id` field as MeiliSearch needs it for the indexation. As we don't have any field here that can be used as an `id`, we use the index of the current element in the array.

If you want to learn more about these options (`indexUid`, `query` and `transformer`) see [indexes options](#-indexes)

After filling in those fields, your MeiliSearch configuration should look like this:

```node
plugins: [
  {
    resolve: 'gatsby-plugin-meilisearch,
    options: {
      host: 'http://localhost:7700',
      apiKey: 'masterKey',
      indexes: [
        {
          indexUid: 'pages_url'
          transformer: data =>
            data.allSitePage.nodes.map((node, index) => ({
              id: index,
              ...node,
            })),
          query: `
            query MyQuery {
              allSitePage {
                nodes {
                  path
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

The `gatsby-plugin-meilisearch` fetches and sends your data for indexation to MeiliSearch on build.

To start a build, simply run:

```bash
gatsby build
```

After the build, a message in your terminal should confirm that your content was successfully indexed:

```bash
success gatsby-plugin-meilisearch - x.xxxs - Documents added to MeiliSearch
```

By going to `http://localhost:7700`, you should also have access to our mini-dashboard and see that your content was indexed 🎉

### 🪄 Integrate search components

If you need tools to integrate a search experience on your app, we have tools that might help you:

- [docs-searchbar](https://github.com/meilisearch/docs-searchbar.js): a tool to display a searchbar on your website
- [meilisearch-react](https://github.com/meilisearch/meilisearch-react): a React UI library that lets you quickly build a search interface in your front-end application

## 🛼 Usage

In the gatsby-config.js file, the MeiliSearch plugin accepts the following options:

### `host` (required)

The `host` field is the address where your MeiliSearch instance is running. `gatsby-plugin-meilisearch` needs it in order to communicate with your MeiliSearch instance, and send your data to it.

### `apiKey` (optional)

The `apiKey` field contains the API key if the MeiliSearch instance is password protected.

### `skipIndexing` (optional)

This option allows you to build your website without indexing to MeiliSearch. Default to false

### `batchSize` (optional)

The number of documents that should be included in each batch. Default to 1000

### `settings` (optional)

If you want to pass settings to your MeiliSearch instance, you can do it here.
[Read more about MeiliSearch settings](https://docs.meilisearch.com/reference/features/settings.html)

### `indexes` (required)

The `indexes` field in an array of objects, each of them representing an [index](https://docs.meilisearch.com/learn/core_concepts/indexes.html#indexes)

You can have one or multiple `index` objects, which can be useful if you want to index your content in separate indexes.

Each `index` object should contain the following fields:

`indexUid` (required)

This is the name of your MeiliSearch index. This is an important field as it is where the retrieved data of the current `index` object will be indexed inside MeiliSearch. For example if your `indexUid` is `pages_url`, your content will be indexed inside the `pages_url` index in MeiliSearch.
If you provide an index name that already exists, the index will be deleted and recreated.

Example:

```bash
indexUid: 'pages_url'
```

You can [learn more about indexes](https://docs.meilisearch.com/learn/core_concepts/indexes.html) on our documentation.

`query` (required)

This is the graphQL query that will be executed in order to retrieve your data.
Your query can be very specific depending on the plugins you're using. If you're not sure about your query, you can use the GraphiQL tool (http://localhost:8000/\_\_\_graphql) provided by Gatsby on development mode to help you build it.

Example:

```bash
query: `
  query MyQuery {
    allSitePage {
      nodes {
        path
      }
    }
  }
`,
```

You can also check [our playground's configuration file](playground/gatsby-config.js) to have an example of a graphQL query using the `gatsby-plugin-mdx` plugin.

`transformer` (required)

This is a function that transforms the fetched data before sending it to MeiliSearch.

After executing the graphQL query, a data object is received with a structure that can differ from one project to another, depending on the query you provided.
As MeiliSearch requires a unique identifier at the root of each document and it should avoid nested objects, you will need to transform your data object accordingly. The `transformer` function is the correct place to do so.

Example:

```bash
transformer: data =>
  data.allSitePage.nodes.map((node, index) => ({
    id: index,
    ...node,
  })),
```

Without using the `transformer` function, the data will look like this:

```node
"data": {
  "allSitePage": {
    "nodes": [
      {
        "path": "/404/"
      },
      {
        "path": "/404.html"
      },
      {
        "path": "/"
      }
    ]
  }
}
```

After using the `transformer` function as in the above example, the data will look like this, and will be ready for indexation:

```node
[
  {
    id: 0,
    path: '/404/',
  },
  {
    id: 1,
    path: '/404.html',
  },
  {
    id: 2,
    path: '/',
  },
];
```

If you want to learn more about MeiliSearch's documents structure, you can do so in [our documentation](https://docs.meilisearch.com/learn/core_concepts/documents.html#structure).

Full usage example:

```node
{
  resolve: 'gatsby-plugin-meilisearch',
  options: {
    host: 'http://localhost:7700',
    apiKey: 'masterKey',
    skipIndexing: false,
    batchSize: 1000,
    options: {
      settings: {
        searchableAttributes: ["*"],
      },
    },
    indexes: [
    {
      indexUid: 'my_index',
      transformer: () => {},
      query: ``
    },
  ],
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
