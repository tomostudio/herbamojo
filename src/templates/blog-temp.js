import React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from 'components/layout';
import Img from 'gatsby-image';

// export default ({data}) => {
//     const post = data.content
//   return (
//     <Layout headerText={post.frontmatter.title}>
//     <div dangerouslySetInnerHTML={{ __html: post.html }} />
//     <div>
//         <h1>Pages List</h1>
//         <h4>{data.all.totalCount} Pages</h4>
//         {data.all.edges.map(({ node }) => (
//         <Link to={node.fields.slug} key={node.id} >
//             <h3>
//                 {node.frontmatter.index}{" "}
//                 {node.frontmatter.title}{" "}
//                 <span>
//                     — {node.frontmatter.date}
//                 </span>
//             </h3>
//             <p>{node.excerpt}</p>
//         </Link>
//         ))}
//     </div>
//     </Layout>
//   )
// }

export default class BlogTemp extends React.Component {
	componentDidMount() {
		console.log('Blog mount', this.props.location.pathname);
		document.body.classList.remove('preloading');
	}
	render() {
		const post = this.props.data.content;
		const next_slug = this.props.pageContext.next_slug;
		const prev_slug = this.props.pageContext.prev_slug;
		return (
			<Layout headerText={post.frontmatter.title}>
				<img src={post.frontmatter.coverimage.childImageSharp.fluid.src} alt="testimage" />
				<Img
					className="image_class"
					fluid={post.frontmatter.coverimage.childImageSharp.fluid}
					backgroundColor="#000"
				/>
				<div dangerouslySetInnerHTML={{ __html: post.html }} />
				<div>
					{next_slug && (
						<Link to={next_slug}>
							<h2>Next Page</h2>
						</Link>
					)}
					{prev_slug && (
						<Link to={prev_slug}>
							<h2>Prev Page</h2>
						</Link>
					)}
				</div>
				<div>
					<h1>Pages List</h1>
					<h4>{this.props.data.all.totalCount} Pages</h4>
					{this.props.data.all.edges.map(({ node }) => (
						<Link to={node.fields.slug} key={node.id}>
							<h3>
								{node.frontmatter.index} {node.frontmatter.title} <span>— {node.frontmatter.date}</span>
							</h3>
							<p>{node.excerpt}</p>
						</Link>
					))}
				</div>
			</Layout>
		);
	}
}

export const query = graphql`
	query($slug: String!) {
		all: allMarkdownRemark(
			filter: { frontmatter: { issetting: { eq: false } } }
			sort: { fields: [frontmatter___index], order: ASC }
		) {
			totalCount
			edges {
				node {
					id
					frontmatter {
						index
						title
						date(formatString: "DD MMMM, YYYY")
					}
					fields {
						slug
					}
					excerpt
				}
			}
		}
		content: markdownRemark(fields: { slug: { eq: $slug } }) {
			html
			frontmatter {
				title
				coverimage {
					childImageSharp {
						fluid(maxWidth: 250) {
							...GatsbyImageSharpFluid_noBase64
						}
					}
				}
			}
		}
	}
`;
