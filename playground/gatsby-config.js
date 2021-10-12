require('dotenv').config()

module.exports = {
  siteMetadata: {
    siteUrl: 'https://www.yourdomain.tld',
    title: 'playground',
  },
  plugins: [
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blog`,
        path: `${__dirname}/src/blog`,
      },
    },
    {
      resolve: 'gatsby-plugin-page-creator',
      options: {
        path: `${__dirname}/src/blog`,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        defaultLayouts: {
          default: require.resolve('./src/components/blog-layout.js'),
        },
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
            },
          },
        ],
      },
    },
    {
      resolve: require.resolve(`../`),
      options: {
        host: process.env.GATSBY_MEILI_HTTP_ADDR || 'http://localhost:7700',
        apiKey: process.env.GATSBY_MEILI_MASTER_KEY || 'masterKey',
        // skipIndexing: true,
        batchSize: 1,
        queries: {
          indexUid: process.env.GATSBY_MEILI_INDEX_NAME || 'my_blog',
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
      },
    },
  ],
}
