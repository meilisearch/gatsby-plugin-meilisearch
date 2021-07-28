/* eslint-disable no-undef */
const { onPostBuild } = require('../gatsby-node.js')
const { fakeConfig, fakeGraphql, fakeReporter } = require('./utils')

const activity = fakeReporter.activityTimer()

describe('validate options', () => {
  test('Has no host', async () => {
    await onPostBuild(
      { graphql: fakeGraphql, reporter: fakeReporter },
      { ...fakeConfig, host: null }
    )
    expect(fakeReporter.error).toHaveBeenCalledTimes(1)
    expect(fakeReporter.error).toHaveBeenCalledWith(
      `[gatsby-plugin-meilisearch] The field "host" is required in the plugin configuration`
    )
    expect(activity.setStatus).toHaveBeenCalledTimes(1)
    expect(activity.setStatus).toHaveBeenCalledWith(
      'Failed to index to MeiliSearch'
    )
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
  test('Queries is an object', async () => {
    await onPostBuild(
      { graphql: fakeGraphql, reporter: fakeReporter },
      { ...fakeConfig, queries: [] }
    )
    expect(fakeReporter.error).toHaveBeenCalledTimes(1)
    expect(fakeReporter.error).toHaveBeenCalledWith(
      `[gatsby-plugin-meilisearch] The field "queries" must be of type object and contain the following fields: "indexUid", "query", "transformer"`
    )
    expect(activity.setStatus).toHaveBeenCalledTimes(1)
    expect(activity.setStatus).toHaveBeenCalledWith(
      'Failed to index to MeiliSearch'
    )
  })
  test('Has indexUid', async () => {
    await onPostBuild(
      { graphql: fakeGraphql, reporter: fakeReporter },
      { ...fakeConfig, queries: { ...fakeConfig.queries, indexUid: null } }
    )
    expect(fakeReporter.error).toHaveBeenCalledTimes(1)
    expect(fakeReporter.error).toHaveBeenCalledWith(
      `[gatsby-plugin-meilisearch] The field "indexUid" in the "queries" object is required in the plugin configuration`
    )
    expect(activity.setStatus).toHaveBeenCalledTimes(1)
    expect(activity.setStatus).toHaveBeenCalledWith(
      'Failed to index to MeiliSearch'
    )
  })
  test('Has query', async () => {
    await onPostBuild(
      { graphql: fakeGraphql, reporter: fakeReporter },
      { ...fakeConfig, queries: { ...fakeConfig.queries, query: null } }
    )
    expect(fakeReporter.error).toHaveBeenCalledTimes(1)
    expect(fakeReporter.error).toHaveBeenCalledWith(
      `[gatsby-plugin-meilisearch] The field "query" in the "queries" object is required in the plugin configuration`
    )
    expect(activity.setStatus).toHaveBeenCalledTimes(1)
    expect(activity.setStatus).toHaveBeenCalledWith(
      'Failed to index to MeiliSearch'
    )
  })
  test('Has transformer', async () => {
    await onPostBuild(
      { graphql: fakeGraphql, reporter: fakeReporter },
      { ...fakeConfig, queries: { ...fakeConfig.queries, transformer: null } }
    )
    expect(fakeReporter.error).toHaveBeenCalledTimes(1)
    expect(fakeReporter.error).toHaveBeenCalledWith(
      `[gatsby-plugin-meilisearch] The field "transformer" in the "queries" object is required in the plugin configuration`
    )
    expect(activity.setStatus).toHaveBeenCalledTimes(1)
    expect(activity.setStatus).toHaveBeenCalledWith(
      'Failed to index to MeiliSearch'
    )
  })
})
