const PLUGIN_NAME = 'gatsby-plugin-meilisearch'

const isObject = obj =>
  obj && typeof obj === 'object' && obj.constructor === Object

const getValidationError = field =>
  `[${PLUGIN_NAME}] The field ${field} is required in the plugin configuration`

const validatePluginOptions = (queries, host) => {
  if (!host) {
    throw getValidationError('"host"')
  }
  if (!isObject(queries)) {
    throw `[${PLUGIN_NAME}] The field "queries" must be of type object and contain the fields "query" and "indexUid"`
  }
  if (!queries.query) {
    throw getValidationError('"query" in the "queries" object')
  }
  if (!queries.indexUid) {
    throw getValidationError('"indexUid" in the "queries" object')
  }
}

exports.onPostBuild = async function ({ graphql, reporter }, config) {
  const activity = reporter.activityTimer(PLUGIN_NAME)
  activity.start()
  try {
    const { queries, host } = config
    if (!queries) {
      reporter.warn(
        `[${PLUGIN_NAME}] No queries provided, nothing has been indexed to MeiliSearch`
      )
      return
    }
    validatePluginOptions(queries, host)
    const { data } = await graphql(queries.query)
    console.log(data)
  } catch (err) {
    reporter.error(err)
    activity.setStatus('Failed to index to MeiliSearch')
  }
  activity.end()
}
