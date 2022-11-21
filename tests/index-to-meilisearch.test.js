/* eslint-disable no-undef */
const { MeiliSearch } = require('meilisearch')
const { onPostBuild } = require('../gatsby-node.js')
const {
  fakeConfig,
  fakeGraphql,
  fakeReporter,
  clearAllIndexes,
  waitForLastTask,
} = require('./utils')

const activity = fakeReporter.activityTimer()

const client = new MeiliSearch({
  host: fakeConfig.host,
  apiKey: fakeConfig.apiKey,
})

describe('Index to Meilisearch', () => {
  beforeEach(async () => {
    return clearAllIndexes({
      host: fakeConfig.host,
      apiKey: fakeConfig.apiKey,
    })
  })

  test('Should fail if the indexes field is not provided', async () => {
    await onPostBuild(
      { graphql: fakeGraphql, reporter: fakeReporter },
      { ...fakeConfig, indexes: null }
    )
    expect(fakeReporter.warn).toHaveBeenCalledTimes(1)
    expect(fakeReporter.warn).toHaveBeenCalledWith(
      `[gatsby-plugin-meilisearch] No indexes provided, nothing has been indexed to Meilisearch`
    )
  })

  test('Should fail on wrong graphQL query', async () => {
    const wrongQuery = `
    query MyQuery {
      allMdx {
        id
      }
    }
  `

    await onPostBuild(
      { graphql: fakeGraphql, reporter: fakeReporter },
      {
        ...fakeConfig,
        indexes: [{ ...fakeConfig.indexes[0], query: wrongQuery }],
      }
    )
    expect(fakeReporter.error).toHaveBeenCalledTimes(1)
    expect(fakeReporter.error).toHaveBeenCalledWith(
      `[gatsby-plugin-meilisearch] You must provide a valid graphQL query`
    )
    expect(activity.setStatus).toHaveBeenCalledTimes(1)
    expect(activity.setStatus).toHaveBeenCalledWith(
      'Failed to index to Meilisearch'
    )
  })

  test('Should fail on wrong transformer format', async () => {
    const wrongTransformer = data => data.allMdx.map(({ node }) => node)

    await onPostBuild(
      { graphql: fakeGraphql, reporter: fakeReporter },
      {
        ...fakeConfig,
        indexes: [{ ...fakeConfig.indexes[0], transformer: wrongTransformer }],
      }
    )
    expect(fakeReporter.error).toHaveBeenCalledTimes(1)
    expect(fakeReporter.error).toHaveBeenCalledWith(
      `data.allMdx.map is not a function`
    )
    expect(activity.setStatus).toHaveBeenCalledTimes(1)
    expect(activity.setStatus).toHaveBeenCalledWith(
      'Failed to index to Meilisearch'
    )
  })

  test('Should fail on wrong document format sent to Meilisearch', async () => {
    const wrongTransformer = data => data

    await onPostBuild(
      { graphql: fakeGraphql, reporter: fakeReporter },
      {
        ...fakeConfig,
        indexes: [{ ...fakeConfig.indexes[0], transformer: wrongTransformer }],
      }
    )
    expect(fakeReporter.error).toHaveBeenCalledTimes(1)
    expect(fakeReporter.error).toHaveBeenCalledWith(
      '[gatsby-plugin-meilisearch] No documents have been indexed to Meilisearch. Make sure your documents are transformed into an array of objects'
    )
    expect(activity.setStatus).toHaveBeenCalledTimes(1)
    expect(activity.setStatus).toHaveBeenCalledWith(
      'Failed to index to Meilisearch'
    )
  })

  test('Should fail on wrong settings format', async () => {
    await onPostBuild(
      { graphql: fakeGraphql, reporter: fakeReporter },
      {
        ...fakeConfig,
        indexes: [
          {
            ...fakeConfig.indexes[0],
            settings: { wrongSettings: 'wrongSettings' },
          },
        ],
      }
    )
    expect(fakeReporter.error).toHaveBeenCalledTimes(1)
    expect(fakeReporter.error).toHaveBeenCalledWith(
      expect.stringMatching(/Json deserialize error: unknown field.*/)
    )
    expect(activity.setStatus).toHaveBeenCalledTimes(1)
    expect(activity.setStatus).toHaveBeenCalledWith(
      'Failed to index to Meilisearch'
    )
  })

  test('Should succeed on good settings format', async () => {
    await onPostBuild(
      { graphql: fakeGraphql, reporter: fakeReporter },
      {
        ...fakeConfig,
        indexes: [
          {
            ...fakeConfig.indexes[0],
            settings: { searchableAttributes: ['title'] },
          },
        ],
      }
    )
    const { searchableAttributes } = await client
      .index(fakeConfig.indexes[0].indexUid)
      .getSettings()
    expect(Array.isArray(searchableAttributes)).toBe(true)
    expect(searchableAttributes).toEqual(['title'])
  })

  test('Should skip the indexation', async () => {
    await onPostBuild(
      { graphql: fakeGraphql, reporter: fakeReporter },
      { ...fakeConfig, skipIndexing: true }
    )
    expect(activity.setStatus).toHaveBeenCalledTimes(1)
    expect(activity.setStatus).toHaveBeenCalledWith('Indexation skipped')
  })

  test('Should succeed on multi indexing', async () => {
    await onPostBuild(
      { graphql: fakeGraphql, reporter: fakeReporter },
      {
        ...fakeConfig,
        indexes: [
          ...fakeConfig.indexes,
          {
            indexUid: 'index2',
            transformer: data => data.allMdx.edges.map(({ node }) => node),
            query: `
                query MyQuery {
                  allMdx {
                    edges {
                      node {
                        id
                      }
                    }
                  }
                }
              `,
          },
        ],
      }
    )
    await waitForLastTask(client)

    const { results } = await client.getIndexes()

    expect(results).toHaveLength(2)
  })

  test('Should delete index and recreate a new one', async () => {
    const firstQuery = `
    query MyQuery {
      allMdx(filter: {frontmatter: {title: {eq: "Axolotl"}}}) {
        edges {
          node {
            id
            slug
          }
        }
      }
    }
  `
    const secondQuery = `
      query MyQuery {
        allMdx(filter: {frontmatter: {title: {eq: "Shoebill"}}}) {
          edges {
            node {
              id
              slug
            }
          }
        }
      }
    `

    await onPostBuild(
      { graphql: fakeGraphql, reporter: fakeReporter },
      {
        ...fakeConfig,
        indexes: [
          {
            ...fakeConfig.indexes[0],
            query: firstQuery,
          },
        ],
      }
    )

    await waitForLastTask(client)

    const firstQueryResult = await client
      .index(fakeConfig.indexes[0].indexUid)
      .search('Axolotl')

    expect(firstQueryResult.estimatedTotalHits).toBe(1)

    await onPostBuild(
      { graphql: fakeGraphql, reporter: fakeReporter },
      {
        ...fakeConfig,
        indexes: [
          {
            ...fakeConfig.indexes[0],
            query: secondQuery,
          },
        ],
      }
    )
    await waitForLastTask(client)

    const secondQueryResult = await client
      .index(fakeConfig.indexes[0].indexUid)
      .search('Axolotl')

    expect(secondQueryResult.estimatedTotalHits).toBe(0)
  })

  test('Should succeed and index with good config format', async () => {
    await onPostBuild(
      { graphql: fakeGraphql, reporter: fakeReporter },
      fakeConfig
    )
    expect(activity.setStatus).toHaveBeenCalledTimes(2)
    expect(activity.setStatus).toHaveBeenLastCalledWith(
      `Documents are send to Meilisearch, track the indexing progress using the tasks ids.\ndoc: https://docs.meilisearch.com/reference/api/tasks.html#get-one-task`
    )
  })
})
