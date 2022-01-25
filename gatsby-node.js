const { MeiliSearch } = require('meilisearch')

const {
  validatePluginOptions,
  validateIndexOptions,
  PLUGIN_NAME,
  getErrorMsg,
} = require('./src/validate')

/**
 * Function triggered after Gatsby's build. Responsible to add the specified data to MeiliSearch.
 *
 * @async
 * @param {Object} gatsbyNodeHelpers - Object containing a set of helpers
 * @param {function} gatsbyNodeHelpers.graphql - Query GraphQL API
 * @param {object} gatsbyNodeHelpers.reporter - Log issues
 * @param {object} config - Plugin's connector.
 * @returns {Promise<void>}
 */
exports.onPostBuild = async function ({ graphql, reporter }, config) {
  const activity = reporter.activityTimer(PLUGIN_NAME)
  activity.start()
  try {
    const {
      host,
      apiKey = '',
      skipIndexing = false,
      batchSize = 1000,
      indexes,
    } = config

    if (skipIndexing) {
      activity.setStatus('Indexation skipped')
      activity.end()
      return
    }

    if (!indexes) {
      reporter.warn(
        getErrorMsg(
          'No indexes provided, nothing has been indexed to MeiliSearch'
        )
      )
      return
    }

    validatePluginOptions(indexes, host)
    await Promise.all(
      indexes.map(async (currentIndex, key) => {
        // Check that the index options are valid
        validateIndexOptions(currentIndex, key)

        // Fetch data with graphQL query
        const { data } = await graphql(currentIndex.query)
        if (!data) {
          throw getErrorMsg('You must provide a valid graphQL query')
        }

        const client = new MeiliSearch({
          host: host,
          apiKey: apiKey,
        })

        const index = client.index(currentIndex.indexUid)
        await index.deleteIfExists()

        // Add settings to Index
        if (currentIndex.settings) {
          const { updateId } = await index.updateSettings(currentIndex.settings)
          index.waitForPendingUpdate(updateId)
        }

        // Prepare data for indexation
        const transformedData = await currentIndex.transformer(data)

        // Index data to MeiliSearch
        const enqueuedUpdates = await index.addDocumentsInBatches(
          transformedData,
          batchSize
        )

        if (enqueuedUpdates.length === 0) {
          throw getErrorMsg(
            'Nothing has been indexed to MeiliSearch. Make sure your documents are transformed into an array of objects'
          )
        }

        // Wait for indexation to be completed
        for (const enqueuedUpdate of enqueuedUpdates) {
          await index.waitForPendingUpdate(enqueuedUpdate.updateId)
          const res = await index.getUpdateStatus(enqueuedUpdate.updateId)
          if (res.status === 'failed') {
            throw getErrorMsg(`${res.error.message} (${res.error.code})`)
          }
        }
      })
    )

    activity.setStatus('Documents added to MeiliSearch')
  } catch (err) {
    reporter.error(err.message || err)
    activity.setStatus('Failed to index to MeiliSearch')
  }
  activity.end()
}
