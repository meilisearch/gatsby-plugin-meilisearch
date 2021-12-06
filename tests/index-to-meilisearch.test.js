/* eslint-disable no-undef */
const { MeiliSearch } = require('meilisearch')
const { onPostBuild } = require('../gatsby-node.js')
const { fakeConfig, fakeGraphql, fakeReporter } = require('./utils')

const activity = fakeReporter.activityTimer()

const client = new MeiliSearch({
  host: fakeConfig.host,
  apiKey: fakeConfig.apiKey,
})

describe('Index to MeiliSearch', () => {
  beforeEach(async () => {
    try {
      await client.deleteIndex(fakeConfig.queries.indexUid)
    } catch (e) {
      return
    }
  })
  test('Has no queries', async () => {
    await onPostBuild(
      { graphql: fakeGraphql, reporter: fakeReporter },
      { ...fakeConfig, queries: null }
    )
    expect(fakeReporter.warn).toHaveBeenCalledTimes(1)
    expect(fakeReporter.warn).toHaveBeenCalledWith(
      `[gatsby-plugin-meilisearch] No queries provided, nothing has been indexed to MeiliSearch`
    )
  })

  test('Wrong graphQL query', async () => {
    const wrongQuery = `
    query MyQuery {
      allMdx {
        id
      }
    }
  `
    await onPostBuild(
      { graphql: fakeGraphql, reporter: fakeReporter },
      { ...fakeConfig, queries: { ...fakeConfig.queries, query: wrongQuery } }
    )
    expect(fakeReporter.error).toHaveBeenCalledTimes(1)
    expect(fakeReporter.error).toHaveBeenCalledWith(
      `Cannot read property 'allMdx' of undefined`
    )
    expect(activity.setStatus).toHaveBeenCalledTimes(1)
    expect(activity.setStatus).toHaveBeenCalledWith(
      'Failed to index to MeiliSearch'
    )
  })

  test('Wrong transformer', async () => {
    const wrongTransformer = data => data.allMdx.map(({ node }) => node)

    await onPostBuild(
      { graphql: fakeGraphql, reporter: fakeReporter },
      {
        ...fakeConfig,
        queries: { ...fakeConfig.queries, transformer: wrongTransformer },
      }
    )
    expect(fakeReporter.error).toHaveBeenCalledTimes(1)
    expect(fakeReporter.error).toHaveBeenCalledWith(
      `data.allMdx.map is not a function`
    )
    expect(activity.setStatus).toHaveBeenCalledTimes(1)
    expect(activity.setStatus).toHaveBeenCalledWith(
      'Failed to index to MeiliSearch'
    )
  })

  test('Wrong document format sent to MeiliSearch', async () => {
    const wrongTransformer = data => data

    await onPostBuild(
      { graphql: fakeGraphql, reporter: fakeReporter },
      {
        ...fakeConfig,
        queries: { ...fakeConfig.queries, transformer: wrongTransformer },
      }
    )
    expect(fakeReporter.error).toHaveBeenCalledTimes(1)
    expect(fakeReporter.error).toHaveBeenCalledWith(
      '[gatsby-plugin-meilisearch] Nothing has been indexed to MeiliSearch. Make sure your documents are transformed into an array of objects'
    )
    expect(activity.setStatus).toHaveBeenCalledTimes(1)
    expect(activity.setStatus).toHaveBeenCalledWith(
      'Failed to index to MeiliSearch'
    )
  })

  test('Document has no id', async () => {
    const wrongQuery = `
    query MyQuery {
      allMdx {
        edges {
          node {
            slug
          }
        }
      }
    }`
    await onPostBuild(
      { graphql: fakeGraphql, reporter: fakeReporter },
      {
        ...fakeConfig,
        queries: { ...fakeConfig.queries, query: wrongQuery },
      }
    )
    expect(fakeReporter.error).toHaveBeenCalledTimes(1)
    expect(fakeReporter.error).toHaveBeenCalledWith(
      `[gatsby-plugin-meilisearch] The primary key inference process failed because the engine did not find any fields containing \`id\` substring in their name. If your document identifier does not contain any \`id\` substring, you can set the primary key of the index. (primary_key_inference_failed)`
    )
    expect(activity.setStatus).toHaveBeenCalledTimes(1)
    expect(activity.setStatus).toHaveBeenCalledWith(
      'Failed to index to MeiliSearch'
    )
  })

  test('Skip indexing', async () => {
    await onPostBuild(
      { graphql: fakeGraphql, reporter: fakeReporter },
      { ...fakeConfig, skipIndexing: true }
    )
    expect(activity.setStatus).toHaveBeenCalledTimes(1)
    expect(activity.setStatus).toHaveBeenCalledWith('Indexation skipped')
  })

  test('Indexation succeeded', async () => {
    await onPostBuild(
      { graphql: fakeGraphql, reporter: fakeReporter },
      fakeConfig
    )
    expect(activity.setStatus).toHaveBeenCalledTimes(1)
    expect(activity.setStatus).toHaveBeenCalledWith(
      'Documents added to MeiliSearch'
    )
  })
})
