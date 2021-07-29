/* eslint-disable no-undef */
const { fakeConfig } = require('./utils')
const { validatePluginOptions, getValidationError } = require('../src/validate')

const fakeGetValidationError = jest.fn(getValidationError)

const validateError = param => {
  return fakeGetValidationError(param)
}

describe('validate options', () => {
  test('Has no host', async () => {
    const validate = () => {
      validatePluginOptions(fakeConfig.queries, null)
    }
    expect(() => validate()).toThrow()
    expect(() => validate()).toThrow(
      `[gatsby-plugin-meilisearch] The field "host" is required in the plugin configuration`
    )
  })
  test('Calls getValidationError function', async () => {
    const validate = () => {
      validatePluginOptions(fakeConfig.queries, null)
    }
    expect(() => validate()).toThrow()
    const errorValue = validateError('"host"')
    expect(fakeGetValidationError).toHaveBeenCalled()
    expect(fakeGetValidationError).toHaveBeenCalledWith('"host"')
    expect(errorValue).toBe(
      `[gatsby-plugin-meilisearch] The field "host" is required in the plugin configuration`
    )
  })

  test("Queries isn't an object", async () => {
    const validate = () => {
      validatePluginOptions([], fakeConfig.host)
    }
    expect(() => validate()).toThrow()
    expect(() => validate()).toThrow(
      `[gatsby-plugin-meilisearch] The field "queries" must be of type object and contain the following fields: "indexUid", "query", "transformer"`
    )
  })
  test('Has no indexUid', async () => {
    const validate = () => {
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
    const validate = () => {
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
    const validate = () => {
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
    const validate = () => {
      validatePluginOptions(fakeConfig.queries, fakeConfig.host)
    }
    expect(() => validate()).not.toThrow()
  })
})
