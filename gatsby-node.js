const validatePluginOptions = config => {
  if (!config.host) {
    throw new Error(`gatsby-plugin-meilisearch: option "host" missing`)
  }
  if (!config.indexes || !config.indexes.query) {
    throw new Error(`gatsby-plugin-meilisearch: option "indexes.query" missing`)
  }
}

exports.onPostBuild = async function ({ graphql, reporter }, config) {
  const activity = reporter.activityTimer(`gatsby-plugin-meilisearch`)
  activity.start()
  try {
    validatePluginOptions(config)
    const { indexes } = config
    const { data } = await graphql(indexes.query)
    console.log(data)
  } catch (err) {
    reporter.error(err)
    activity.setStatus('Failed to index to MeiliSearch')
  }
  activity.end()
}
