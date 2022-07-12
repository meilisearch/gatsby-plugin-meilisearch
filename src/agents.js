const { version } = require('../package.json')

const constructClientAgents = (clientAgents = []) => {
  const gatsbyAgent = `Meilisearch Gatsby (v${version})`

  return clientAgents.concat(gatsbyAgent)
}

module.exports = {
  constructClientAgents,
}
