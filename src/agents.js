const { version } = require('../package.json')

const constructClientAgents = (clientAgents = []) => {
  const instantMeilisearchAgent = `Meilisearch Gatsby (v${version})`

  return clientAgents.concat(instantMeilisearchAgent)
}

module.exports = {
  constructClientAgents,
}
