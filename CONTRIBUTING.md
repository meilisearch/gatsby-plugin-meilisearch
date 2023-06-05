# Contributing <!-- omit in toc -->

First of all, thank you for contributing to Meilisearch! The goal of this document is to provide everything you need to know in order to contribute to Meilisearch and its different integrations.

- [Assumptions](#assumptions)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Git Guidelines](#git-guidelines)
- [Release Process (for internal team only)](#release-process-for-internal-team-only)

## Assumptions

1. **You're familiar with [GitHub](https://github.com) and the [Pull Request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests)(PR) workflow.**
2. **You've read the Meilisearch [documentation](https://www.meilisearch.com/docs) and the [README](/README.md).**
3. **You know about the [Meilisearch community](https://discord.com/invite/meilisearch). Please use this for help.**

## How to Contribute

1. Make sure that the contribution you want to make is explained or detailed in a GitHub issue! Find an [existing issue](https://github.com/meilisearch/gatsby-plugin-meilisearch/issues/) or [open a new one](https://github.com/meilisearch/gatsby-plugin-meilisearch/issues/new).
2. Once done, [fork the gatsby-plugin-meilisearch repository](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) in your own GitHub account. Ask a maintainer if you want your issue to be checked before making a PR.
3. [Create a new Git branch](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-and-deleting-branches-within-your-repository).
4. Review the [Development Workflow](#development-workflow) section that describes the steps to maintain the repository.
5. Make the changes on your branch.
6. [Submit the branch as a PR](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork) pointing to the `main` branch of the main gatsby-plugin-meilisearch repository. A maintainer should comment and/or review your Pull Request within a few days. Although depending on the circumstances, it may take longer.<br>
   We do not enforce a naming convention for the PRs, but **please use something descriptive of your changes**, having in mind that the title of your PR will be automatically added to the next [release changelog](https://github.com/meilisearch/gatsby-plugin-meilisearch/releases/).

## Development Workflow

### Setup <!-- omit in toc -->

We suggest using `yarn` as the lock file is in yarn and thus we ensure a working dev environment.

```bash
yarn
```

### Tests and Linter <!-- omit in toc -->

Each PR should pass the tests and the linter to be accepted.

```bash
# Run a Meilisearch instance
docker pull getmeili/meilisearch:latest # Fetch the latest version of Meilisearch image from Docker Hub
docker run -p 7700:7700 getmeili/meilisearch:latest meilisearch --master-key=masterKey --no-analytics

# Tests the project
yarn test # integration tests
yarn test:e2e # end to end tests

# Tests the project in watch/open mode
yarn test:watch
yarn test:e2e:watch

# Linter
yarn lint
# Linter with fixing
yarn lint:fix
```


Some environement variables are needed in order to run the `test` command: `MEILI_HTTP_ADDR`, `MEILI_MASTER_KEY`, and `MEILI_INDEX_NAME`. It is possible to provide them in a `.env` file inside the `tests` folder.

Example of `.env`:

```bash
MEILI_HTTP_ADDR="http://localhost:7700"
MEILI_MASTER_KEY="masterKey"
MEILI_INDEX_NAME="my_index"
```

### Run Playground

To test directly your changes with watch mode, you can run the Gatsby playground:

```bash
# Root of repository
yarn playground:dev
```

This command will install the required dependencies, build the project, and serve it. You should be able to reach it on the [port 9000 of your localhost](http://localhost:9000/).

You may also just want to generate a build without serving it. If so, run the following command:

```bash
yarn playground:build
```

If you want to specify your host, API key and index name, you can do so by editing the `gatsby-config.js` file, as well as the `src/pages/index.js` file if you want to test the playground's front-end.
Alternatively, you can set the environment variables `GATSBY_MEILI_HTTP_ADDR`, `GATSBY_MEILI_MASTER_KEY`, and `GATSBY_MEILI_INDEX_NAME`. It is possible to provide them in a `.env` file at the root of the playground.

Example of `.env`:

```bash
GATSBY_MEILI_HTTP_ADDR="http://localhost:7700"
GATSBY_MEILI_MASTER_KEY="masterKey"
GATSBY_MEILI_INDEX_NAME="my_index"
```

## Git Guidelines

### Git Branches <!-- omit in toc -->

All changes must be made in a branch and submitted as PR.
We do not enforce any branch naming style, but please use something descriptive of your changes.

### Git Commits <!-- omit in toc -->

As minimal requirements, your commit message should:

- be capitalized
- not finish by a dot or any other punctuation character (!,?)
- start with a verb so that we can read your commit message this way: "This commit will ...", where "..." is the commit message.
  e.g.: "Fix the home page button" or "Add more tests for create_index method"

We don't follow any other convention, but if you want to use one, we recommend [this one](https://chris.beams.io/posts/git-commit/).

### GitHub Pull Requests <!-- omit in toc -->

Some notes on GitHub PRs:

- [Convert your PR as a draft](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/changing-the-stage-of-a-pull-request) if your changes are a work in progress: no one will review it until you pass your PR as ready for review.<br>
  The draft PR can be very useful if you want to show that you are working on something and make your work visible.
- The branch related to the PR must be **up-to-date with `main`** before merging. Fortunately, this project [integrates a bot](https://github.com/meilisearch/integration-guides/blob/main/resources/bors.md) to automatically enforce this requirement without the PR author having to do it manually.
- All PRs must be reviewed and approved by at least one maintainer.
- The PR title should be accurate and descriptive of the changes. The title of the PR will be indeed automatically added to the next [release changelogs](https://github.com/meilisearch/gatsby-plugin-meilisearch/releases/).

## Release Process (for the internal team only)

Meilisearch tools follow the [Semantic Versioning Convention](https://semver.org/).

### Automation to Rebase and Merge the PRs <!-- omit in toc -->

This project integrates a bot that helps us manage pull requests merging.<br>
_[Read more about this](https://github.com/meilisearch/integration-guides/blob/main/resources/bors.md)._

### Automated Changelogs

This project integrates a tool to create automated changelogs.<br>
_[Read more about this](https://github.com/meilisearch/integration-guides/blob/main/resources/release-drafter.md)._

### How to Publish the Release

⚠️ Before doing anything, make sure you got through the guide about [Releasing an Integration](https://github.com/meilisearch/integration-guides/blob/main/resources/integration-release.md).

Make a PR modifying the file [`package.json`](/package.json) with the right version.

```javascript
"version": "X.X.X",
```

Once the changes are merged on `main`, you can publish the current draft release via the [GitHub interface](https://github.com/meilisearch/gatsby-plugin-meilisearch/releases): on this page, click on `Edit` (related to the draft release) > update the description (be sure you apply [these recommendations](https://github.com/meilisearch/integration-guides/blob/main/resources/integration-release.md#writting-the-release-description)) > when you are ready, click on `Publish release`.

GitHub Actions will be triggered and push the package to [npm](https://www.npmjs.com/package/gatsby-plugin-meilisearch).

<hr>

Thank you again for reading this through. We can not wait to begin to work with you if you make your way through this contributing guide ❤️
