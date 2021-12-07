/* eslint-disable no-undef */

const fakeConfig = {
  host: process.env.MEILI_HTTP_ADDR || 'http://localhost:7700',
  apiKey: process.env.MEILI_MASTER_KEY || 'masterKey',
  indexes: [
    {
      indexUid: process.env.MEILI_INDEX_NAME || 'my_blog',
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
  ],
}

const fakeGraphql = async query => {
  try {
    const res = await fetch('http://localhost:8000/___graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
    return await res.json()
  } catch (err) /* istanbul ignore next */ {
    console.log({ err })
    return {}
  }
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
