const { MeiliSearch } = require('meilisearch')
const { constructClientAgents } = require('./src/agents')
const {
  validatePluginOptions,
  validateIndexOptions,
  PLUGIN_NAME,
  getErrorMsg,
} = require('./src/validate')

/**
 * Function triggered after Gatsby's build. Responsible to add the specified data to Meilisearch.
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
      batchSize = 10000,
      indexes,
      clientAgents = [],
    } = config

    if (skipIndexing) {
      activity.setStatus('Indexation skipped')
      activity.end()
      return
    }

    if (!indexes) {
      reporter.warn(
        getErrorMsg(
          'No indexes provided, nothing has been indexed to Meilisearch'
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
          clientAgents: constructClientAgents(clientAgents),
        })

        const index = await client.index(currentIndex.indexUid)
        await index.delete()
        // Add settings to Index
        if (currentIndex.settings) {
          await index.updateSettings(currentIndex.settings)
        }

        // Prepare data for indexation
        const transformedData = await currentIndex.transformer(data)

        const tasks = []

        for (let i = 0; i < transformedData.length; i += batchSize) {
          let documentsActivity = reporter.activityTimer(PLUGIN_NAME)
          documentsActivity.start()
          try {
            const documentsBatch = transformedData.slice(i, i + batchSize)
            if (documentsBatch.length > 0) {
              const task = await index.addDocuments(documentsBatch)

              documentsActivity.setStatus(
                `Adding ${documentsBatch.length} documents to Meilisearch, track the process with the task id : "${task.taskUid}". (doc: https://docs.meilisearch.com/reference/api/tasks.html#get-one-task)`
              )

              tasks.push(task)
            }
          } catch (err) {
            documentsActivity.setStatus(
              'Failed to send batch of document to Meilisearch'
            )
          }
          documentsActivity.end()
        }

        if (tasks.length === 0) {
          throw getErrorMsg(
            'No documents have been indexed to Meilisearch. Make sure your documents are transformed into an array of objects'
          )
        }
      })
    )
    activity.setStatus(
      'Documents are send to Meilisearch, track the indexing progress using the tasks ids.'
    )
  } catch (err) {
    reporter.error(err.message || err)
    activity.setStatus('Failed to index to Meilisearch')
  }
  activity.end()
}
