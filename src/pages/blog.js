import React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from 'components/layout';
import Img from 'gatsby-image';

export default ({ data }) => (
	<Layout headerText="List">
		<div>
			<h1> Pages List </h1>{' '}
			<h4>
				{' '}
				{data.allMarkdownRemark.totalCount}
				Pages{' '}
			</h4>{' '}
			{data.allMarkdownRemark.edges.map(({ node }) => (
				<Link to={node.fields.slug} key={node.id}>
					<h3>
						{' '}
						{node.frontmatter.index} {node.frontmatter.title} <span> —{node.frontmatter.date} </span>{' '}
					</h3>{' '}
					<Img
						className="image_class"
						fluid={node.frontmatter.coverimage.childImageSharp.fluid}
						backgroundColor="#000"
					/>{' '}
					{/* <p>{node.excerpt}</p> */} <br />
				</Link>
			))}{' '}
		</div>{' '}
	</Layout>
);

export const query = graphql`
	query {
		allMarkdownRemark(
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
						slug
						coverimage {
							childImageSharp {
								fluid(maxWidth: 250) {
									...GatsbyImageSharpFluid_noBase64
								}
							}
						}
					}
					fields {
						slug
					}
					excerpt
				}
			}
		}
	}
`;
