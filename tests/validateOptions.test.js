/* eslint-disable no-undef */
const { fakeConfig } = require('./utils')
const { validatePluginOptions } = require('../src/validate')

// Rajouter des tests pour couvrir les cas : ca marche + ca marche pas

describe('validate options', () => {
  test('Has no host', async () => {
    function validate() {
      validatePluginOptions(fakeConfig.queries, null)
    }
    expect(() => validate()).toThrow()
    expect(() => validate()).toThrow(
      `[gatsby-plugin-meilisearch] The field "host" is required in the plugin configuration`
    )
  })
  test("Queries isn't an object", async () => {
    function validate() {
      validatePluginOptions([], fakeConfig.host)
    }
    expect(() => validate()).toThrow()
    expect(() => validate()).toThrow(
      `[gatsby-plugin-meilisearch] The field "queries" must be of type object and contain the following fields: "indexUid", "query", "transformer"`
    )
  })
  test('Has no indexUid', async () => {
    function validate() {
      validatePluginOptions(
        { ...fakeConfig.queries, indexUid: null },
        fakeConfig.host
      )
    }
    expect(() => validate()).toThrow()
    expect(() => validate()).toThrow(
      `[gatsby-plugin-meilisearch] The field "indexUid" in the "queries" object is required in the plugin configuration`
    )
  })
  test('Has no query', async () => {
    function validate() {
      validatePluginOptions(
        { ...fakeConfig.queries, query: null },
        fakeConfig.host
      )
    }
    expect(() => validate()).toThrow()
    expect(() => validate()).toThrow(
      `[gatsby-plugin-meilisearch] The field "query" in the "queries" object is required in the plugin configuration`
    )
  })
  test('Has no transformer', async () => {
    function validate() {
      validatePluginOptions(
        { ...fakeConfig.queries, transformer: null },
        fakeConfig.host
      )
    }
    expect(() => validate()).toThrow()
    expect(() => validate()).toThrow(
      `[gatsby-plugin-meilisearch] The field "transformer" in the "queries" object is required in the plugin configuration`
    )
  })
  test('Has valid options', async () => {
    function validate() {
      validatePluginOptions(fakeConfig.queries, fakeConfig.host)
    }
    expect(() => validate()).not.toThrow()
  })
})
