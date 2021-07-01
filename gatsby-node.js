const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

// REMARK RELATIVE IMAGE
const traverse = require('traverse');
const { defaults, isString, find } = require('lodash');

const slash = (path) => {
  const isExtendedLengthPath = /^\\\\\?\\/.test(path);

  if (isExtendedLengthPath) {
    return path;
  }
  return path.replace(/\\/g, `/`);
};

const findMatchingFile = (src, files, options) => {
  const result = find(files, (file) => {
    const staticPath = slash(path.join(options.staticFolderName, src));
    return slash(path.normalize(file.absolutePath)).endsWith(staticPath);
  });
  if (!result) {
    throw `No matching file found for src "${src}" in static folder "${options.staticFolderName}". Please check static folder name and that file exists at "${options.staticFolderName}${src}". This error will probably cause a "GraphQLDocumentError" later in build. All converted field paths MUST resolve to a matching file in the "static" folder.`;
  }
  return result;
};

let checkstatus = false;
let redirectObject = null;
let journalslug = 'journal';
let journalperList = 6;
let journaldisable = false;

exports.onCreateNode = ({ node, getNode, getNodesByType, actions }) => {
  // // REMARK RELATIVE IMAGE v2

  if (node.internal.type === `MarkdownRemark` || node.internal.type === `Mdx`) {
    const files = getNodesByType(`File`);

    const directory = path.dirname(node.fileAbsolutePath);

    const options = {
      staticFolderName: 'static',
      include: [],
      exclude: [],
    };
    // Deeply iterate through frontmatter data for absolute paths
    traverse(node.frontmatter).forEach(function (value) {
      if (!isString(value)) return;
      if (!path.isAbsolute(value) || !path.extname(value)) return;

      let shouldTransform = options.include.length < 1;

      if (options.include.some((a) => paths.includes(a))) {
        shouldTransform = true;
      }

      if (options.exclude.some((a) => paths.includes(a))) {
        shouldTransform = false;
      }

      if (!shouldTransform) return;

      const file = findMatchingFile(value, files, options);
      const newValue = path.relative(directory, file.absolutePath);
      // console.log(file ? `file found ${newValue}` : 'file not found');

      this.update(newValue);
    });
  }

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

    const filepath = createFilePath({
      node,
      getNode,
      basePath: 'src/',
    });

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
          all: allmarkdownRemark(
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
    externals: ['@netlify/zip-it-and-ship-it'],
  });
};
