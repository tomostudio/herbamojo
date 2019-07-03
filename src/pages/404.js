// import React from "react"
// import { graphql } from "gatsby"
// import Layout from "components/layout"

// export default ({location, data}) => (
//     <Layout headerText="404" location={location}>
//         <div>
//             <h1>Pages List</h1>
//             <h4>{data.allMarkdownRemark.totalCount} Pages</h4>
//         </div>
//     </Layout>
// )

export default () => {
    if (typeof window !== 'undefined') {
        window.location = '/';
    }

    return null;
}
