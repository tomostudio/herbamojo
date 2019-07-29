const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);
let checkstatus = false;
let redirectObject = null;
let journalslug = 'journal';

exports.onCreateNode = ({ graphql, node, getNode, actions }) => {
  const { createRedirect } = actions;

  if (checkstatus && redirectObject !== null) {
    redirectObject.redirect.forEach(redirectRequest => {
      // console.table(redirectRequest);
      if (redirectRequest.status) {
        const __from = redirectRequest.from;
        createRedirect({
          fromPath: __from,
          toPath: redirectRequest.to,
          isPermanent: true
        });
      }
    });
  }

  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    // if (node.frontmatter.issetting && node.frontmatter.contenttype === 'events')
    //   eventsslug = node.frontmatter.slug;
  }

  if (node.internal.type === `MarkdownRemark`) {
    const filepath = createFilePath({
      node,
      getNode,
      basePath: `src`
    });
    let slug = node.frontmatter.slug;
    if (!node.frontmatter.indonesia) {
      if (filepath.includes('pages/journal/'))
			slug = `${journalslug}/${node.frontmatter.slug}`;
      createNodeField({
        node,
        name: `slug`,
        value: slug
      });
    } else {
      if (filepath.includes('pages/journal_id/'))
        slug = `id/${journalslug}/${node.frontmatter.slug}`;
      createNodeField({
        node,
        name: `slug`,
        value: slug
      });
    }
  }
};

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  return new Promise((resolve, reject) => {
    resolve(
      graphql(`
        {
          all: allMarkdownRemark(
            filter: { frontmatter: { issetting: { eq: false } } }
            sort: { fields: [frontmatter___date], order: DESC }
          ) {
            edges {
              node {
                fields {
                  slug
                }
                frontmatter {
									date
                  issetting
                  contenttype
                  active
                }
              }
            }
          }
          slug_setting: markdownRemark(
            frontmatter: {
              issetting: { eq: true }
              contenttype: { eq: "slug_setting" }
            }
          ) {
            frontmatter {
              title
              issetting
              redirect {
                from
                to
                status
              }
            }
          }
        }
      `).then(result => {
        const results = result.data.all.edges;
        results.forEach(({ node }, index) => {
          if (
            node.frontmatter.contenttype === 'journal' &&
            node.frontmatter.active === true
          ) {
            createPage({
              path: node.fields.slug,
              component: path.resolve(`./src/templates/journal-temp.js`),
              context: {
                slug: node.fields.slug
              }
            });
          }
        });

        if (result.data.slug_setting) {
          redirectObject = result.data.slug_setting.frontmatter;
          checkstatus = true;
        }
      })
    );
  });
};

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules']
    }
  });
};
