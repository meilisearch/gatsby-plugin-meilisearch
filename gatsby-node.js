exports.pluginOptionsSchema = ({ Joi }) => {
  return Joi.object({
    host: Joi.string().required(),
    apiKey: Joi.any(),
    skipIndexing: Joi.any(),
    indexes: Joi.object({
      indexUid: Joi.any(),
      query: Joi.string().required(),
    }),
  })
}

exports.onPostBuild = async function ({ graphql, reporter }, config) {
  const activity = reporter.activityTimer(`Running gatsby-plugin-meilisearch`)
  activity.start()
  try {
    const { indexes } = config
    const { data } = await graphql(indexes.query)
    console.log(data)
  } catch (err) {
    reporter.error(err)
  }
  activity.end()
}
