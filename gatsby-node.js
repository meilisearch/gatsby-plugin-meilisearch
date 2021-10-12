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
    const { queries, host, apiKey = '', batchSize = 1000 } = config
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
    const enqueuedUpdates = await index.addDocumentsInBatches(
      transformedData,
      batchSize
    )

    // Wait for indexation to be completed
    enqueuedUpdates.forEach(async enqueuedUpdate => {
      await index.waitForPendingUpdate(enqueuedUpdate.updateId)
      const res = await index.getUpdateStatus(enqueuedUpdate.updateId)
      if (res.status === 'failed') {
        throw getErrorMsg(res.message)
      }
    })

    activity.setStatus('Documents added to MeiliSearch')
  } catch (err) {
    reporter.error(err.message || err)
    activity.setStatus('Failed to index to MeiliSearch')
  }
  activity.end()
}
