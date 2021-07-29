const PLUGIN_NAME = 'gatsby-plugin-meilisearch'

const getErrorMsg = msg => `[${PLUGIN_NAME}] ${msg}`

const isObject = obj =>
  obj && typeof obj === 'object' && obj.constructor === Object

const getValidationError = field =>
  `[${PLUGIN_NAME}] The field ${field} is required in the plugin configuration`

const validatePluginOptions = (queries, host) => {
  if (!host) {
    throw getValidationError('"host"')
  }
  if (!isObject(queries)) {
    throw getErrorMsg(
      'The field "queries" must be of type object and contain the following fields: "indexUid", "query", "transformer"'
    )
  }
  if (!queries.indexUid) {
    throw getValidationError('"indexUid" in the "queries" object')
  }
  if (!queries.query) {
    throw getValidationError('"query" in the "queries" object')
  }
  if (!queries.transformer) {
    throw getValidationError('"transformer" in the "queries" object')
  }
}

module.exports = {
  validatePluginOptions,
  getValidationError,
  getErrorMsg,
  PLUGIN_NAME,
}
