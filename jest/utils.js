/* eslint-disable no-undef */
const axios = require('axios')

const fakeConfig = {
  host: 'http://localhost:7700',
  apiKey: 'masterKey',
  // skipIndexing: true,
  queries: {
    indexUid: 'my_blog',
    transformer: data => data.allMdx.edges.map(({ node }) => node),
    query: `
      query MyQuery {
        allMdx {
          edges {
            node {
              id
              slug
              frontmatter {
                title
                cover
              }
              tableOfContents
            }
          }
        }
      }
    `,
  },
}
const fakeGraphql = async query => {
  return await axios({
    method: 'post',
    url: 'http://localhost:8000/___graphql',
    headers: { 'Content-Type': 'application/json' },
    data: query,
  })
}

const activityTimer = {
  start: jest.fn(() => {}),
  setStatus: jest.fn(() => {}),
  end: jest.fn(() => {}),
}

const fakeReporter = {
  activityTimer: () => activityTimer,
  warn: jest.fn(() => {}),
  error: jest.fn(() => {}),
}

module.exports = {
  fakeConfig,
  fakeGraphql,
  fakeReporter,
}
