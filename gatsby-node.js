const PLUGIN_NAME = 'gatsby-plugin-meilisearch'

const getValidationError = field =>
  `[${PLUGIN_NAME}] Field "${field}" is not defined in the collection schema`

const validatePluginOptions = (indexes, host) => {
  if (!host) {
    throw new Error(getValidationError('host'))
  }
  if (!indexes.query) {
    throw new Error(getValidationError('indexes.query'))
  }
  if (!indexes.indexUid) {
    throw new Error(getValidationError('indexes.indexUid'))
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
    reporter.error(err.message)
    activity.setStatus('Failed to index to MeiliSearch')
  }
  activity.end()
}
