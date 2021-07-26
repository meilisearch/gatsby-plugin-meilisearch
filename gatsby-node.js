const { MeiliSearch } = require('meilisearch')

const PLUGIN_NAME = 'gatsby-plugin-meilisearch'

const isObject = obj =>
  obj && typeof obj === 'object' && obj.constructor === Object

const getValidationError = field =>
  `[${PLUGIN_NAME}] The field ${field} is required in the plugin configuration`

const getErrorMsg = msg => `[${PLUGIN_NAME}] ${msg}`

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

exports.onPostBuild = async function ({ graphql, reporter }, config) {
  const activity = reporter.activityTimer(PLUGIN_NAME)
  activity.start()
  try {
    const { queries, host, apiKey = '' } = config
    if (!queries) {
      reporter.warn(
        getErrorMsg(
          'No queries provided, nothing has been indexed to MeiliSearch'
        )
      )
      return
    }
    validatePluginOptions(queries, host)

    // Get graphQL data
    const { data } = await graphql(queries.query)

    const client = new MeiliSearch({
      host: host,
      apiKey: apiKey,
    })

    // Prepare data for indexation
    const transformedData = await queries.transformer(data)

    // Create index
    const index = await client.getOrCreateIndex(queries.indexUid)

    // Index data to MeiliSearch
    const { updateId } = await index.addDocuments(transformedData)

    // Check status
    await index.waitForPendingUpdate(updateId)
    const res = await index.getUpdateStatus(updateId)
    if (res.status === 'failed') {
      throw getErrorMsg(res.message)
    }

    activity.setStatus('Documents added to MeiliSearch')
  } catch (err) {
    reporter.error(err.message || err)
    activity.setStatus('Failed to index to MeiliSearch')
  }
  activity.end()
}
