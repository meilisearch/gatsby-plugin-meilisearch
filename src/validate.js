const PLUGIN_NAME = 'gatsby-plugin-meilisearch'

/**
 * Formats the error message with plugin name at the beginning
 *
 * @param {string} msg - Error message to display
 * @returns {string}
 */
const getErrorMsg = msg => `[${PLUGIN_NAME}] ${msg}`

/**
 * Checks if the given parameter is an object
 *
 * @param {*} obj - Parameter to check
 * @returns {boolean}
 */
const isObject = obj =>
  obj && typeof obj === 'object' && obj.constructor === Object

/**
 * Formats the error message for a required field
 *
 * @param {string} field - Field name
 * @returns {string}
 */
const getValidationError = field =>
  `[${PLUGIN_NAME}] The field ${field} is required in the plugin configuration`

/**
 * Check if the given index object has valid options
 *
 * @param {Object} index - Object to verify
 * @param {string} index.indexUid - Index name
 * @param {string} index.query - GraphQL query used to retrieve the user's data
 * @param {function} index.transformer - Function that transforms the data to a format accepted by Meilisearch
 * @param {number} key - Index position in it's parent array
 */
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

/**
 * Check if the options passed to the plugin are valid
 *
 * @param  {object} config - Information to pass to the constructor.
 * @param  {String} config.host - Host of the Meilisearch server.
 * @param  {String} [config.apiKey] - Apikey of the Meilisearch server.
 * @param  {String} config.indexes - List of indexes.
 * @param  {String} [config.skipIndexing] - Boolean to disable indexing.
 * @param  {String} [config.batchSize] - Size of batches of documents when indexing.
 * @param  {String} [config.clientAgents] - Clients from which the plugin is called.
 *
 */
const validatePluginOptions = config => {
  const {
    host,
    apiKey = '',
    skipIndexing = false,
    batchSize = 1000,
    indexes,
    clientAgents = [],
  } = config

  if (!host) {
    throw getValidationError('"host"')
  }

  if (typeof apiKey !== 'string') {
    throw getErrorMsg('The "apiKey" option should be of type string')
  }

  if (typeof skipIndexing !== 'boolean') {
    throw getErrorMsg('The "skipIndexing" option should be of type boolean')
  }

  if (typeof batchSize !== 'number') {
    throw getErrorMsg('The "batchSize" option should be of type number')
  }

  if (!Array.isArray(clientAgents)) {
    throw getErrorMsg('The "clientAgents" option should be of type array')
  }

  if (!Array.isArray(indexes)) {
    throw getErrorMsg('The "indexes" option should be of type array')
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
