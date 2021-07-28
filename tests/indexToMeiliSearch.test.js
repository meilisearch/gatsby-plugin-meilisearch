/* eslint-disable no-undef */
const { onPostBuild } = require('../gatsby-node.js')
const { fakeConfig, fakeGraphql, fakeReporter } = require('./utils')

const activity = fakeReporter.activityTimer()

describe('index to MeiliSearch', () => {
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
      `[gatsby-plugin-meilisearch] invalid type: map, expected a sequence at line 1 column 1`
    )
    expect(activity.setStatus).toHaveBeenCalledTimes(1)
    expect(activity.setStatus).toHaveBeenCalledWith(
      'Failed to index to MeiliSearch'
    )
  })

  test('Document has no id', async () => {
    const wrongQuery = `
    query MyQuery {
      allMdx(filter: {frontmatter: {title: {eq: "Axolotl"}}}) {
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
      `[gatsby-plugin-meilisearch] document doesn't have an identifier {"slug":"axolotl"}`
    )
    expect(activity.setStatus).toHaveBeenCalledTimes(1)
    expect(activity.setStatus).toHaveBeenCalledWith(
      'Failed to index to MeiliSearch'
    )
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
