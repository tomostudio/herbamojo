const { fmImagesToRelative } = require('gatsby-remark-relative-images');
const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);
let checkstatus = false;
exports.onCreateNode = ({ node, getNode, actions }) => {
	const { createRedirect } = actions;

	if(checkstatus){
		// createRedirect({
		// 	fromPath: '/google',
		// 	toPath: '/admin/',
		// 	isPermanent: true
		// });
		createRedirect({
			fromPath: '/home2',
			toPath: 'https://google.com/',
			isPermanent: true
		});
	}
	fmImagesToRelative(node);
	const { createNodeField } = actions;
	if (node.internal.type === `MarkdownRemark`) {
		const filepath = createFilePath({
			node,
			getNode,
			basePath: `src`
		});
		let slug = node.frontmatter.slug;

		if (filepath.includes('pages/blog/')) slug = 'blog/' + node.frontmatter.slug;
		createNodeField({
			node,
			name: `slug`,
			value: slug
		});
	}
};
exports.createPages = ({ graphql, actions }) => {
	const { createPage } = actions;
	console.log('create pages');
	checkstatus = true;
	return graphql(`
      {
        allMarkdownRemark (
          filter: { frontmatter: { issetting: { eq: false }} }
          sort:{fields: [frontmatter___index], order: ASC}
        ){
          edges {
            node {
              fields {
                slug
							}
							frontmatter{
								contenttype
							}
            }
          }
        }
      }
    `).then((result) => {
		const results = result.data.allMarkdownRemark.edges;
		results.forEach(({ node }, index) => {
			if(node.frontmatter.contenttype == 'blog'){
				createPage({
					path: node.fields.slug,
					component: path.resolve(`./src/templates/blog-temp.js`),
					context: {
						slug: node.fields.slug,
						prev_slug: index === 0 ? null : results[index - 1].node.fields.slug,
						next_slug: index === results.length - 1 ? null : results[index + 1].node.fields.slug,
						start_node: results[0].node
					}
				});
			}
			else if(node.frontmatter.contenttype == 'about'){
				createPage({
					path: node.fields.slug,
					component: path.resolve(`./src/templates/about.js`),
					context: {
						slug: node.fields.slug,
					}
				});
			}
		});
	});
};

exports.onCreateWebpackConfig = ({ stage, actions }) => {
	actions.setWebpackConfig({
		resolve: {
			modules: [ path.resolve(__dirname, 'src'), 'node_modules' ]
		}
	});
};
