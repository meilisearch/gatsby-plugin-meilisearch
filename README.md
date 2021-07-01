<p align="center">
  <img src="https://res.cloudinary.com/meilisearch/image/upload/v1587402338/SDKs/meilisearch_gatsby.svg" alt="MeiliSearch Gatsby" width="200" height="200" />
</p>

<h1 align="center">Gatsby plugin MeiliSearch ⚠ WIP ⚠️</h1>

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
<p align="center">This is still a work-in-progress. Thereby, PRs and bug issues are welcome, but please do not submit any new feature requests 🙏</p>

<br/>

## Table of Contents

- [📖 Documentation](#-documentation)
- [🔧 Installation](#-installation)
- [🏃‍♀️ Run MeiliSearch](#-run-meilisearch)
- [🎬 Usage](#-usage)
  - [Basic](#basic)
  - [Customization](#customization)
- [💡 Run the Playground](#-run-the-playground)
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

## 🎬 Usage

### Basic

### Customization

## 💡 Run the Playground

## 🤖 Compatibility with MeiliSearch and Gatsby

## ⚙️ Development Workflow and Contributing

Any new contribution is more than welcome in this project!

If you want to know more about the development workflow or want to contribute, please visit our [contributing guidelines](/CONTRIBUTING.md) for detailed instructions!
