/* eslint-disable no-undef */
const { fakeConfig } = require('./utils')
const {
  validatePluginOptions,
  validateIndexOptions,
  getValidationError,
} = require('../src/validate')

const fakeGetValidationError = jest.fn(getValidationError)

const validateError = param => {
  return fakeGetValidationError(param)
}

describe('validate options', () => {
  test('Should fail with no "host" field', async () => {
    const validate = () => {
      validatePluginOptions(fakeConfig.queries, null)
    }
    expect(() => validate()).toThrow(
      `[gatsby-plugin-meilisearch] The field "host" is required in the plugin configuration`
    )
  })
  test('Should call "getValidationError" function', async () => {
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

  test('Should fail if "indexes" field isn’t an array', async () => {
    const validate = () => {
      validatePluginOptions({}, fakeConfig.host)
    }
    expect(() => validate()).toThrow(
      `[gatsby-plugin-meilisearch] The "indexes" option should be of type array`
    )
  })

  test('Should fail "index" field isn’t an object', async () => {
    const validate = () => {
      validateIndexOptions([], 0)
    }
    expect(() => validate()).toThrow(
      `[gatsby-plugin-meilisearch] Each index inside the "indexes" field must be of type object and contain the following fields: "indexUid", "query", "transformer" (in "indexes" at position 0)`
    )
  })

  test('Should fail if "index" field has no indexUid', async () => {
    const validate = () => {
      validateIndexOptions({ ...fakeConfig.indexes[0], indexUid: null }, 0)
    }
    expect(() => validate()).toThrow(
      `[gatsby-plugin-meilisearch] The field "indexUid" (in "indexes" at position 0) is required in the plugin configuration`
    )
  })
  test('Should fail if "index" field has no query', async () => {
    const validate = () => {
      validateIndexOptions({ ...fakeConfig.indexes[0], query: null }, 0)
    }
    expect(() => validate()).toThrow(
      `[gatsby-plugin-meilisearch] The field "query" (in "indexes" at position 0) is required in the plugin configuration`
    )
  })
  test('Should fail if "index" field has no transformer', async () => {
    const validate = () => {
      validateIndexOptions({ ...fakeConfig.indexes[0], transformer: null }, 0)
    }
    expect(() => validate()).toThrow(
      `[gatsby-plugin-meilisearch] The field "transformer" (in "indexes" at position 0) is required in the plugin configuration`
    )
  })
  test('Should succeed if "index" field has valid options', async () => {
    const validate = () => {
      validatePluginOptions(fakeConfig.indexes, fakeConfig.host)
    }
    expect(() => validate()).not.toThrow()
  })
})
