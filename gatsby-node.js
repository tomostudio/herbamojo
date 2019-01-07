
const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.onCreateNode = ({ node, getNode , actions}) => {
    const { createNodeField } = actions
    if (node.internal.type === `MarkdownRemark`) {
      const slug = createFilePath({ node, getNode, basePath: `pages` })
      createNodeField({
        node,
        name: `slug`,
        value: slug,
      })
    }
  }
  exports.createPages = ({ graphql, actions }) => {
    const { createPage } = actions
    return graphql(`
      {
        allMarkdownRemark {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
      }
    `
  ).then(result => {
      // console.log(JSON.stringify(result, null, 4))
      const results = result.data.allMarkdownRemark.edges;
      results.forEach(({ node }, index) => {
        createPage({
          path: node.fields.slug,
          component: path.resolve(`./src/templates/blog-temp.js`),
          context: {
            slug: node.fields.slug,
            prev_slug: index === 0 ? null : results[index - 1].node.fields.slug,
            next_slug: index === results.length - 1 ? null : results[index + 1].node.fields.slug,
            start_node: results[0].node,
          },
        })
      })
    })
  }

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, "src"), "node_modules"],
    },
  })
}