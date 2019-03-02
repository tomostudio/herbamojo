import React from "react"
import {graphql } from 'gatsby';
import Layout from "components/layout"

export default class About extends React.Component {
    componentDidMount(){
        console.log('about mount');
    }
    render() {
		const post = this.props.data.content;
        return (
        <Layout headerText={post.frontmatter.title} location={this.props.location}>
            <p>Such wow. Very React.</p>
        </Layout>
        )
    }
}

// export default () => (
//     <Layout headerText="About">
//     <p>Such wow. Very React.</p>
//   </Layout>
// )


export const query = graphql`
	query($slug: String!) {
		content: markdownRemark(fields: { slug: { eq: $slug } }) {
			html
			frontmatter {
				title
			}
		}
	}
`;
