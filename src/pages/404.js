import React from "react"
import { graphql } from "gatsby"
import Layout from "components/layout"

export default ({location, data}) => (
    <Layout headerText="404" location={location}>
        <div>
            <h1>Pages List</h1>
            <h4>{data.allMarkdownRemark.totalCount} Pages</h4>
        </div>
    </Layout>
)

export const query = graphql`
  query {
    allMarkdownRemark(
      filter: { frontmatter: { issetting: { eq: false }, contenttype: {eq: "blog"}} }
      sort: { fields: [frontmatter___index], order: ASC }){
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
  }
`
