const { MeiliSearch } = require('meilisearch')

const {
  validatePluginOptions,
  PLUGIN_NAME,
  getErrorMsg,
} = require('./src/validate')

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

    // Fetch data with graphQL query
    const { data } = await graphql(queries.query)

    const client = new MeiliSearch({
      host: host,
      apiKey: apiKey,
    })

    // Prepare data for indexation
    const transformedData = await queries.transformer(data)

    const index = client.index(queries.indexUid)

    // Index data to MeiliSearch
    const { updateId } = await index.addDocuments(transformedData)

    // Wait for indexation to be completed
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
