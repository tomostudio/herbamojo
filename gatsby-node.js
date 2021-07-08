const path = require(`path`);

let checkstatus = false;
let redirectObject = null;
let journalslug = 'journal';
let journalperList = 6;
let journaldisable = false;

exports.onCreateNode = (args) => {
  const { node, getNode, getNodesByType, actions } = args;
  // console.log(args);

  const { createRedirect, createNodeField } = actions;

  if (checkstatus && redirectObject !== null) {
    redirectObject.redirect.forEach((redirectRequest) => {
      if (redirectRequest.status) {
        const __from = redirectRequest.from;
        createRedirect({
          fromPath: __from,
          toPath: redirectRequest.to,
          isPermanent: true,
        });
      }
    });
  }

  if (node.internal.type === `MarkdownRemark` || node.internal.type === `Mdx`) {
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
          isPermanent: true,
        });

        createRedirect({
          fromPath: `/id/${journalslug}/1`,
          toPath: `/id/${journalslug}`,
          isPermanent: true,
        });
      }
    }
    if (
      node.frontmatter.issetting &&
      node.frontmatter.contenttype === 'homeshop_setting'
    ) {
      const { offlineshop, onlineshop } = node.frontmatter;
      //AUTOMATICALLY REPLACE BLANK LSIT FOR OFFLINE & ONLINE SHOP
      const blankobject = {
        background: 'transparent',
        image: '',
        link: '',
      };
      if (
        !offlineshop.offlineshoplist ||
        offlineshop.offlineshoplist === null ||
        typeof offlineshop.offlineshoplist != 'object'
      ) {
        node.frontmatter.offlineshop.offlineshoplist = [blankobject];
      }
      if (
        !onlineshop.onlineshoplist ||
        onlineshop.onlineshoplist === null ||
        typeof onlineshop.onlineshoplist != 'object'
      ) {
        node.frontmatter.onlineshop.onlineshoplist = [blankobject];
      }
    }

    let slug = node.frontmatter.slug;
    if (!node.frontmatter.indonesia) {
      if (node.fileAbsolutePath.includes('journal/'))
        slug = `/${journalslug}/${node.frontmatter.slug}`;
    } else {
      if (node.fileAbsolutePath.includes('journal_id/'))
        slug = `/id/${journalslug}/${node.frontmatter.slug}`;
    }

    if (slug) {
      // console.log('slug', slug);
      createNodeField({
        node,
        name: `slug`,
        value: slug,
      });
    }
  }
};

exports.createPages = async ({ graphql, actions, reporter }) => {
  const result = await graphql(`
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
      `)


  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  const allResults = result.data.all.edges;

  if (!journaldisable && allResults.length > 1) {
    if (result.data.slug_setting) {
      redirectObject = result.data.slug_setting.frontmatter;
      checkstatus = true;
    }

    //CREATE LIST PAGE
    const journalen = allResults.filter(function (data) {
      return (
        data.node.frontmatter.contenttype === 'journal' &&
        data.node.frontmatter.active === true &&
        data.node.frontmatter.indonesia === false
      );
    });

    const journalid = allResults.filter(function (data) {
      return (
        data.node.frontmatter.contenttype === 'journal' &&
        data.node.frontmatter.active === true &&
        data.node.frontmatter.indonesia === true
      );
    });

    journalen.forEach(({ node }, index) => {
      let nextslug, prevslug;
      if (index === 0) {
        prevslug = null;
      } else {
        prevslug = journalen[index - 1].node.fields.slug;
      }
      if (index >= journalen.length - 1) {
        nextslug = null;
      } else {
        nextslug = journalen[index + 1].node.fields.slug;
      }
      if (!journaldisable) {
        actions.createPage({
          path: node.fields.slug,
          component: path.resolve(`./src/templates/journal-temp.js`),
          context: {
            slug: node.fields.slug,
            prev: prevslug,
            next: nextslug,
            indo: false,
          },
        });
      }
    });

    journalid.forEach(({ node }, index) => {
      let nextslug, prevslug;
      if (index === 0) {
        prevslug = null;
      } else {
        prevslug = journalid[index - 1].node.fields.slug;
      }
      if (index >= journalid.length - 1) {
        nextslug = null;
      } else {
        nextslug = journalid[index + 1].node.fields.slug;
      }
      if (!journaldisable) {
        actions.createPage({
          path: node.fields.slug,
          component: path.resolve(`./src/templates/journal-temp.js`),
          context: {
            slug: node.fields.slug,
            prev: prevslug,
            next: nextslug,
            indo: true,
          },
        });
      }
    });

    //GET PAGE NUMBER
    const lengthEN = Math.ceil(journalen.length / journalperList);
    const lengthID = Math.ceil(journalid.length / journalperList);

    // LIST ENGLISH
    if (lengthEN > 0) {
      Array.from({
        length: lengthEN,
      }).forEach((_, i) => {
        let listpath;
        if (i === 0) {
          listpath = `/${journalslug}`;
        } else {
          listpath = `/${journalslug}/${i + 1}`;
        }
        if (!journaldisable) {
          actions.createPage({
            path: listpath,
            component: path.resolve(
              './src/templates/journal-list-temp.js'
            ),
            context: {
              limit: journalperList,
              skip: i * journalperList,
              index: i,
              indo: false,
              slug: listpath,
              total: lengthEN,
              alttotal: lengthID,
            },
          });
        }
      });
    }

    // LIST INDONESIA
    if (lengthID > 0) {
      Array.from({
        length: lengthID,
      }).forEach((_, i) => {
        let listpath;
        if (i === 0) {
          listpath = `/id/${journalslug}`;
        } else {
          listpath = `/id/${journalslug}/${i + 1}`;
        }
        if (!journaldisable) {
          actions.createPage({
            path: listpath,
            component: path.resolve(
              './src/templates/journal-list-temp.js'
            ),
            context: {
              limit: journalperList,
              skip: i * journalperList,
              index: i,
              slug: listpath,
              indo: true,
              total: lengthID,
              alttotal: lengthEN,
            },
          });
        }
      });
    }
  }


};

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
    externals: ['@netlify/zip-it-and-ship-it'],
  });
};
