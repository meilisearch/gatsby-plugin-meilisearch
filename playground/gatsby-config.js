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
        host: 'http://127.0.0.1:7700',
        apiKey: 'masterKey',
        skipIndexing: true,
        indexes: {
          indexUid: 'MyBlog',
          query: `
            query MyQuery {
              allMdx {
                edges {
                  node {
                    frontmatter {
                      title
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
