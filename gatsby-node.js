const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);
let checkstatus = false;
let redirectObject = null;
let journalslug = 'journal';
let journalperList = 6;
let journaldisable = false;

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
    ) {
      journalperList = node.frontmatter.journalperlist;
      journalslug = node.frontmatter.journalslug;
      journaldisable = node.frontmatter.journaldisable;
      if (!journaldisable) {
        createRedirect({
          fromPath: `/${journalslug}/1`,
          toPath: `/${journalslug}`,
          isPermanent: true
        });

        createRedirect({
          fromPath: `/id/${journalslug}/1`,
          toPath: `/id/${journalslug}`,
          isPermanent: true
        });
      }
    }
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
        slug = `/${journalslug}/${node.frontmatter.slug}`;
      createNodeField({
        node,
        name: `slug`,
        value: slug
      });
    } else {
      if (filepath.includes('pages/journal_id/'))
        slug = `/id/${journalslug}/${node.frontmatter.slug}`;
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
        if (!journaldisable && results.length > 1) {
          // results.forEach(({ node }, index) => {
          //   if (
          //     node.frontmatter.contenttype === 'journal' &&
          //     node.frontmatter.active === true
          //   ) {
          //     createPage({
          //       path: node.fields.slug,
          //       component: path.resolve(`./src/templates/journal-temp.js`),
          //       context: {
          //         slug: node.fields.slug
          //       }
          //     });
          //   }
          // });

          if (result.data.slug_setting) {
            redirectObject = result.data.slug_setting.frontmatter;
            checkstatus = true;
          }

          //CREATE LIST PAGE
          const journalen = results.filter(function(data) {
            return (
              data.node.frontmatter.contenttype === 'journal' &&
              data.node.frontmatter.active === true &&
              data.node.frontmatter.indonesia === false
            );
          });
          const journalid = results.filter(function(data) {
            return (
              data.node.frontmatter.contenttype === 'journal' &&
              data.node.frontmatter.active === true &&
              data.node.frontmatter.indonesia === true
            );
          });

          journalen.forEach(({ node }, index) => {
            let nextslug, prevslug;
            if(index === 0){
              prevslug = null;
            }
            else{
              prevslug = journalen[index - 1].node.fields.slug;
            }
            if(index >= (journalen.length - 1)){
              nextslug = null;
            }
            else{
              nextslug = journalen[index + 1].node.fields.slug;
            }
            createPage({
              path: node.fields.slug,
              component: path.resolve(`./src/templates/journal-temp.js`),
              context: {
                slug: node.fields.slug,
                prev: prevslug,
                next: nextslug
              }
            });
          });
          journalid.forEach(({ node }, index) => {
            let nextslug, prevslug;
            if(index === 0){
              prevslug = null;
            }
            else{
              prevslug = journalid[index - 1].node.fields.slug;
            }
            if(index >= (journalid.length - 1)){
              nextslug = null;
            }
            else{
              nextslug = journalid[index + 1].node.fields.slug;
            }
            createPage({
              path: node.fields.slug,
              component: path.resolve(`./src/templates/journal-temp.js`),
              context: {
                slug: node.fields.slug,
                prev: prevslug,
                next: nextslug
              }
            });
          });

          //GET PAGE NUMBER
          const lengthEN = Math.ceil(journalen.length / journalperList);
          const lengthID = Math.ceil(journalid.length / journalperList);

          //ENGLISH
          if (lengthEN > 0) {
            Array.from({
              length: lengthEN
            }).forEach((_, i) => {
              let listpath;
              if (i === 0) {
                listpath = `/${journalslug}`;
              } else {
                listpath = `/${journalslug}/${i + 1}`;
              }
              createPage({
                path: listpath,
                component: path.resolve('./src/templates/journal-list-temp.js'),
                context: {
                  limit: journalperList,
                  skip: i * journalperList,
                  index: i,
                  indo: false,
                  slug: listpath,
                  total: lengthEN,
                  alttotal: lengthID
                }
              });
            });
          }

          //INDONESIA
          if (lengthID > 0) {
            Array.from({
              length: lengthID
            }).forEach((_, i) => {
              let listpath;
              if (i === 0) {
                listpath = `/id/${journalslug}`;
              } else {
                listpath = `/id/${journalslug}/${i + 1}`;
              }
              createPage({
                path: listpath,
                component: path.resolve(
                  './src/templates/journal-list-temp-id.js'
                ),
                context: {
                  limit: journalperList,
                  skip: i * journalperList,
                  index: i,
                  slug: listpath,
                  indo: true,
                  total: lengthID,
                  alttotal: lengthEN
                }
              });
            });
          }
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
