const path = require(`path`)

// Creates a `test` page to test that the plugin and the playground are linked together
exports.createPages = ({ actions }) => {
  const { createPage } = actions
  const blogPostTemplate = path.resolve(`src/components/blog-layout.js`)

  createPage({
    path: `test`,
    component: blogPostTemplate,
    context: {
      frontmatter: {
        title: 'Test page',
      },
    },
  })
}
