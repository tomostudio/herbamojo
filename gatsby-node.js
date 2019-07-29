const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);
let checkstatus = false;
let redirectObject = null;
let journalslug = 'journal';
let journalperList = 6;

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
    if (
      node.frontmatter.issetting &&
      node.frontmatter.contenttype === 'general_setting'
    )
      journalperList = node.frontmatter.journalperlist;
    if (
      node.frontmatter.issetting &&
      node.frontmatter.contenttype === 'general_setting'
    )
      journalslug = node.frontmatter.journalslug;
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
                  indonesia
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

        //CREATE LIST PAGE
        const journalen = results.filter(function(data) {
          return (data.node.frontmatter.contenttype === 'journal' && data.node.frontmatter.active === true && data.node.frontmatter.indonesia === false)
        });
        const journalid = results.filter(function(data) {
          return (data.node.frontmatter.contenttype === 'journal' && data.node.frontmatter.active === true && data.node.frontmatter.indonesia === true)
        });

        //GET PAGE NUMBER
				const lengthEN = Math.ceil(journalen.length / journalperList);
        const lengthID = Math.ceil(journalid.length / journalperList);

        //ENGLISH
				if (lengthEN > 0) {
					Array.from({
						length: lengthEN
					}).forEach((_, i) => {
						createPage({
							path: i === 0 ? `/${journalslug}` : `/${journalslug}/${i + 1}`,
							component: path.resolve('./src/templates/journal-list-temp.js'),
							context: {
								limit: journalperList,
								skip: i * journalperList,
								index: i,
								total: lengthEN
							}
						});
					});
        }
        //INDONESIA
				if (lengthID > 0) {
					Array.from({
						length: lengthID
					}).forEach((_, i) => {
						createPage({
							path: i === 0 ? `/id/${journalslug}` : `/${journalslug}/${i + 1}`,
							component: path.resolve('./src/templates/journal-list-temp-id.js'),
							context: {
								limit: journalperList,
								skip: i * journalperList,
								index: i,
								total: lengthID
							}
						});
					});
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
