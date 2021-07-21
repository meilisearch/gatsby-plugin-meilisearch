const PLUGIN_NAME = 'gatsby-plugin-meilisearch'

const getValidationError = field =>
  `[${PLUGIN_NAME}] The Field ${field} is required in the plugin configuration`

const validatePluginOptions = (indexes, host) => {
  if (!host) {
    throw getValidationError('host')
  }
  if (!indexes.query) {
    throw getValidationError('query in the indexes object')
  }
  if (!indexes.indexUid) {
    throw getValidationError('indexUid in the indexes object')
  }
}

exports.onPostBuild = async function ({ graphql, reporter }, config) {
  const activity = reporter.activityTimer(PLUGIN_NAME)
  activity.start()
  try {
    const { indexes = {}, host } = config
    validatePluginOptions(indexes, host)
    const { data } = await graphql(indexes.query)
    console.log(data)
  } catch (err) {
    reporter.error(err)
    activity.setStatus('Failed to index to MeiliSearch')
  }
  activity.end()
}
