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
 * @param {Array.<Object>} indexes - List of indexes
 * @param {string} host - Meilisearch's server address
 */
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
