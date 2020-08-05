const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);
const _ = require(`lodash`);
const cheerio = require(`cheerio`);
const slash = require(`slash`);
const deepMap = require('deep-map');
const polyfill = require(`babel-polyfill`);

let checkstatus = false;
let redirectObject = null;
let journalslug = 'journal';
let journalperList = 6;
let journaldisable = false;
// const { fmImagesToRelative } = require('gatsby-remark-relative-images');

const fileNodes = [];

exports.onCreateNode = ({ node, getNode, actions, createNodeId }) => {
  const { createRedirect, createNodeField } = actions;

  // fmImagesToRelative(node);
  // CUSTOM 'FM Images to Relative' In case file path is not absolute.
  fileNodes.push(node);
  // Only process markdown files
  if (node.internal.type === `MarkdownRemark` || node.internal.type === `Mdx`) {
    // Convert paths in frontmatter to relative

    function makeRelative(value) {
      if (
        _.isString(value) &&
        (value.startsWith('assets') || value.startsWith('/assets'))
      ) {
        // Incase if file is not absolute
        if (!path.isAbsolute(value)) value = `/${value}`;
        if (path.isAbsolute(value)) {
          let imagePath;
          const foundImageNode = _.find(fileNodes, (file) => {
            if (!file.dir) return;
            imagePath = path.join(file.dir, path.basename(value));
            return (
              slash(path.normalize(file.absolutePath)) === slash(imagePath)
            );
          });
          if (foundImageNode) {
            return slash(
              path.relative(path.join(node.fileAbsolutePath, '..'), imagePath)
            );
          }
        }
      }
      return value;
    }
    // Deeply iterate through frontmatter data for absolute paths
    deepMap(node.frontmatter, makeRelative, { inPlace: true });
  }

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
    const filepath = createFilePath({
      node,
      getNode,
      basePath: `src`,
    });
    let slug = node.frontmatter.slug;
    if (!node.frontmatter.indonesia) {
      if (filepath.includes('journal/'))
        slug = `/${journalslug}/${node.frontmatter.slug}`;
      createNodeField({
        node,
        name: `slug`,
        value: slug,
      });
    } else {
      if (filepath.includes('journal_id/'))
        slug = `/id/${journalslug}/${node.frontmatter.slug}`;
      createNodeField({
        node,
        name: `slug`,
        value: slug,
      });
    }
    // SCHEMA EXPERIMENT
    /* if (
      !node.frontmatter.issetting &&
      node.frontmatter.contenttype === 'journal'
    ) {

      // PUSH POST MANUALLY
      actions.createNode({
        id: createNodeId(`Journal-${node.id}`),
        parent: node.id,
        slug: node.fields.slug,
        seo: node.frontmatter.seo,
        internal: {
          type: 'JournalMarkdown',
          contentDigest: node.internal.contentDigest,
        },
      });
    } */
    // SCHEMA EXPERIMENT
  }
};

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  // allMarkdownRemark(
  return new Promise((resolve, reject) => {
    resolve(
      graphql(`
        {
          all: allMdx(
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
          slug_setting: mdx(
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
      `).then((result) => {
        const results = result.data.all.edges;
        if (!journaldisable && results.length > 1) {
          if (result.data.slug_setting) {
            redirectObject = result.data.slug_setting.frontmatter;
            checkstatus = true;
          }

          //CREATE LIST PAGE
          const journalen = results.filter(function (data) {
            return (
              data.node.frontmatter.contenttype === 'journal' &&
              data.node.frontmatter.active === true &&
              data.node.frontmatter.indonesia === false
            );
          });

          const journalid = results.filter(function (data) {
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
              createPage({
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
              createPage({
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
                createPage({
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
                createPage({
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
      })
    );
  });
};

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
  });
};
