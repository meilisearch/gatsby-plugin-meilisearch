const PLUGIN_NAME = 'gatsby-plugin-meilisearch'

const getErrorMsg = msg => `[${PLUGIN_NAME}] ${msg}`

const isObject = obj =>
  obj && typeof obj === 'object' && obj.constructor === Object

const getValidationError = field =>
  `[${PLUGIN_NAME}] The field ${field} is required in the plugin configuration`

const validateIndexOptions = (index, key) => {
  if (!isObject(index)) {
    throw getErrorMsg(
      `Each index inside the "indexes" field must be of type object and contain the following fields: "indexUid", "query", "transformer" (in "indexes" at position ${key})`
    )
  }
  if (!index.indexUid) {
    throw getValidationError(`"indexUid" (in "indexes" at position ${key})`)
  }
  if (!index.query) {
    throw getValidationError(`"query" (in "indexes" at position ${key})`)
  }
  if (!index.transformer) {
    throw getValidationError(`"transformer" (in "indexes" at position ${key})`)
  }
}

const validatePluginOptions = (indexes, host) => {
  if (!host) {
    throw getValidationError('"host"')
  }

  if (!Array.isArray(indexes)) {
    throw getErrorMsg('The "indexes" option should be of type array')
  }
}

module.exports = {
  validatePluginOptions,
  validateIndexOptions,
  getValidationError,
  getErrorMsg,
  PLUGIN_NAME,
}
