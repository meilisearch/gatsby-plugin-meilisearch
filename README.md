<p align="center">
  <img src="https://raw.githubusercontent.com/meilisearch/integration-guides/main/assets/logos/meilisearch_gatsby.svg" alt="Meilisearch Gatsby" width="200" height="200" />
</p>

<h1 align="center">Gatsby plugin Meilisearch</h1>

<h4 align="center">
  <a href="https://github.com/meilisearch/meilisearch">Meilisearch</a> |
  <a href="https://docs.meilisearch.com">Documentation</a> |
  <a href="https://slack.meilisearch.com">Slack</a> |
  <a href="https://www.meilisearch.com">Website</a> |
  <a href="https://docs.meilisearch.com/faq">FAQ</a>
</h4>

<p align="center">
  <a href="https://ms-bors.herokuapp.com/repositories/47"><img src="https://bors.tech/images/badge_small.svg" alt="Bors enabled"></a>
  <a href="https://github.com/meilisearch/gatsby-plugin-meilisearch/actions"><img src="https://github.com/meilisearch/gatsby-plugin-meilisearch/workflows/Tests/badge.svg" alt="Tests"></a>
  <a href="https://github.com/meilisearch/gatsby-plugin-meilisearch/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-informational" alt="License"></a>
</p>
<br/>

<p align="center" style="font-weight:bold;" >A plugin to index your Gatsby content to Meilisearch based on graphQL queries</p>

<br/>

## Table of Contents

- [📖 Documentation](#-documentation)
- [🔧 Installation](#-installation)
- [🎬 Getting started](#-getting-started)
- [🛼 Usage](#-usage)
- [🤖 Compatibility with Meilisearch and Gatsby](#-compatibility-with-meilisearch-and-gatsby)
- [⚙️ Development Workflow and Contributing](#-development-workflow-and-contributing)

## 📖 Documentation

To understand Meilisearch and how it works, see the [Meilisearch's documentation](https://docs.meilisearch.com/learn/what_is_meilisearch/).

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

### 🏃‍♀️ Run Meilisearch

There are many easy ways to [download and run a Meilisearch instance](https://docs.meilisearch.com/reference/features/installation.html#download-and-launch).

For example, if you use Docker:

```bash
docker pull getmeili/meilisearch:latest # Fetch the latest version of Meilisearch image from Docker Hub
docker run -it --rm -p 7700:7700 getmeili/meilisearch:latest ./meilisearch --master-key=masterKey
```

With this command, your Meilisearch instance `host` is `http://localhost:7700` and your master key is `masterKey`

### 🚀 Run Gatsby

If you don't have a running Gatsby, you can either launch the [playground present in this project)(./playground/README.md) or [create a Gatsby project](https://www.gatsbyjs.com/docs/tutorial).

Run your app if it is not running yet:

```bash
gatsby develop
```

Now that your Gatsby app is running you have access to the following URLs:

- `http://localhost:8000/` URL of your web app.
- `http://localhost:8000/___graphql`: URL to the GraphiQL tool where you can build graphQL queries on the playground and request them.

## 🎬 Getting started

Now you should have a running Gatsby app with `gatsby-plugin-meilisearch` installed and a running Meilisearch instance.

Let's configure our plugin to make it work! In this example, we will fetch every page's URL of our Gatsby website, and index them to Meilisearch.

To make the plugin work, open the `gatsby-config.js` configuration file located at the root of your Gatsby project. All the configuration takes place in that file.

### ⚙️ Configure your plugin options

#### 🔑 Add your Meilisearch credentials

First, you need to add your Meilisearch credentials.

The credentials are composed of:

- The `host`: The url to your running Meilisearch instance.
- The `api_key`: The `master` key or another `key` with the permission to add documents in MeiliSearch. [More about permissions and API keys here](https://docs.meilisearch.com/learn/advanced/security.html).

⚠️ Keys with permissions other than `search` should never be used on your front end. For searching, use the `Default Search Key` key available on [the `key` route](https://docs.meilisearch.com/reference/api/keys.html#get-keys) or [create a custom API key](https://docs.meilisearch.com/learn/advanced/security.html) with only search rights.

Add the credentials the following way in your `gatsby-config.js` file:

```js
{
  plugins: [
    {
      resolve: 'gatsby-plugin-meilisearch',
      options: {
        host: 'http://localhost:7700',
        apiKey: 'masterKey',
      },
    },
  ]
}
```

See [this section](#-run-meilisearch) if you don't know what your credentials are.

#### ☝️ Fill in the indexes field

The next step is to define which data we want to add in Meilisearch and how. This happens in the `indexes` field.

The `indexes` field is an array that can be composed of multiple index objects. Each index object contains the following information:

**`indexUid`**: The name of the index in which the data is added.

Let's define the index uid to `pages_url`. On build, the `pages_url` index is created inside Meilisearch.

```bash
indexUid: 'pages_url'
```

_if `pages_url` already existed, it is deleted and recreated on build_

**`query`**: GraphQL query fetching the data to add in Meilisearch

Let's provide the graphQL query that retrieves the URL's of the pages of our application.

```js
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

After executing this query, we receive a `data` object containing the following:

```js
{
  data: {
    allSitePage: {
      nodes: [
        {
          path: '/404/'
        },
        {
          path: '/404.html'
        },
        {
          path: '/'
        }
      ]
    }
  }
}
```

**`transformer`**: Transform the data fetched to a format compatible to Meilisearch.

Now that we have fetched the data with the `query` field, it is not yet ready to be sent to Meilisearch.

Using a `transformer` function, we can transform the fetched data to a compatible format.

The first problem of the fetched data is that the documents to send to Meilisearch are nested, while they should be at the root in an array. So the content of `nodes` should be at the root.

```js
{
  data: {
    allSitePages: {
     nodes: [
       {
        'path': '/404/'
      },
     ]
    }
  }
}
```

should become:
```js
[
  {
    'path': '/404/'
  },
  {
    'path': '/'
  },
]
```

The second problem is that each document in Meilisearch requires an unique indentifier called [primary key](https://docs.meilisearch.com/learn/core_concepts/documents.html#primary-field).

Thus every document needs a unique field called `id`.
For example:
```js
{
  'id': 1
  'path': '/404/'
},
```

To do so, we need to use the transformer method to create the final compatible array of objects:
```js
{
  transformer: data =>
    data.allSitePage.nodes.map((node, index) => ({
      id: index,
      ...node,
    })),
}
```

In this function, we map on `data.allSitePage.nodes` in order to return an array of objects that can be indexed by Meilisearch. We add an `id` field as Meilisearch needs it for the indexation. As we don't have any field here that can be used as an `id`, we use the index of the current element in the array.

If you want to learn more about these options (`indexUid`, `query` and `transformer`) see [indexes options](#-indexes)

#### 🎉 Complete configuration

After filling in those fields, your Meilisearch configuration should look like this:

```js
plugins: [
  {
    resolve: 'gatsby-plugin-meilisearch',
    options: {
      host: 'http://localhost:7700',
      apiKey: 'masterKey',
      indexes: [
        {
          indexUid: 'pages_url',
          transformer: (data) =>
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
];
```

### 🥁 Build your project

The `gatsby-plugin-meilisearch` fetches and adds your data to Meilisearch on your Gatsby build.

```bash
gatsby build
```

After the build, a message in your terminal confirms that your content was successfully indexed:

```bash
success gatsby-plugin-meilisearch - x.xxxs - Documents added to Meilisearch
```

### 🪄 Integrate search components

If you need tools to integrate a search experience on your app, we have tools that might help you:

- [docs-searchbar](https://github.com/meilisearch/docs-searchbar.js): a tool to display a searchbar on your website
- [meilisearch-react](https://github.com/meilisearch/meilisearch-react): a React UI library that lets you quickly build a search interface in your front-end application

## 🛼 Usage

In the gatsby-config.js file, the Meilisearch plugin accepts the following options:

### `host` (required)

The `host` field is the address where your Meilisearch instance is running. `gatsby-plugin-meilisearch` needs it in order to communicate with your Meilisearch instance, and send your data to it.

### `apiKey` (optional)

The `apiKey` field contains the API key if the Meilisearch instance is password protected.

### `skipIndexing` (optional)

This option allows you to build your website without indexing to Meilisearch. Default to false

### `batchSize` (optional)

The number of documents that should be included in each batch. Default to 1000

### `settings` (optional)

If you want to pass settings to your Meilisearch instance, you can do it here.
[Read more about Meilisearch settings](https://docs.meilisearch.com/reference/features/settings.html)

### `indexes` (required)

The `indexes` field is an array of objects, each of them represents how to add data to a specific [index](https://docs.meilisearch.com/learn/core_concepts/indexes.html#indexes)

You can have one or multiple `index` objects in `indexes`, which can be useful if you want to index different content in different indexes (or multiple different data to the same index).

Each `index` object should contain the following fields:

`indexUid` (required)

This is the name of your Meilisearch index. This is a required field as it is where the retrieved data is added inside Meilisearch. For example if your `indexUid` is `pages_url`, your content will be indexed inside the `pages_url` index in Meilisearch.
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

This is a function that transforms the fetched data before sending it to Meilisearch.

After executing the graphQL query, a data object is received with a structure that can differ from one project to another, depending on the query you provided.
As Meilisearch requires a unique identifier at the root of each document and it should avoid nested objects, you will need to transform your data object accordingly. The `transformer` function is the correct place to do so.

Example:

```js
transformer: data =>
  data.allSitePage.nodes.map((node, index) => ({
    id: index,
    ...node,
  })),
```

Without using the `transformer` function, the data will look like this:

```js
{
  data: {
    allSitePage: {
      nodes: [
        {
          path: '/404/'
        },
        {
          path: '/404.html'
        },
        {
          path: '/'
        }
      ]
    }
  }
}
```

After using the `transformer` function as in the above example, the data will look like this, and will be ready for indexation:

```js
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

If you want to learn more about Meilisearch's documents structure, you can do so in [our documentation](https://docs.meilisearch.com/learn/core_concepts/documents.html#structure).

Full usage example:

```js
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

## 🤖 Compatibility with Meilisearch and Gatsby

**Supported Gatsby versions**:

- Gastby v4.3.x

(This plugin may work with the older Gatsby versions, but these are not tested nor officially supported at this time.)

**Supported Meilisearch versions**:

This package only guarantees the compatibility with the [version v0.25.0 of Meilisearch](https://github.com/meilisearch/meilisearch/releases/tag/v0.25.0).

**Node / NPM versions**:

- NodeJS >= 14.15.X && <= 16.X
- NPM >= 6.x

**We recommend always using the latest version of Gatsby to start your new projects**.

## ⚙️ Development Workflow and Contributing

Any new contribution is more than welcome in this project!

If you want to know more about the development workflow or want to contribute, please visit our [contributing guidelines](/CONTRIBUTING.md) for detailed instructions!
