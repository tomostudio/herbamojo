import React from "react"
import  { StaticQuery, graphql } from "gatsby"
import Header from "components/header"
import "stylesheet/main.scss"
import { Helmet } from "react-helmet"

// export default class Layout extends React.Component {
//     componentDidMount(){
//         console.log('default layout mount');
//     }
//     render() {
//         return (
//             <StaticQuery
//                 query={graphql`
//                 query {
//                     site {
//                     siteMetadata {
//                         title
//                     }
//                     }
//                 }
//                 `
//                 }
//                 render={data => (
//                 <div style={{ margin: `3rem auto`, maxWidth: 600 }}>
        
//                 <Helmet>
//                     <meta charSet="utf-8" />
//                     <title>Default</title>
//                 </Helmet>
//                     {data.site.siteMetadata.title}
//                     <Header headerText={this.props.headerText}/>
//                     {this.props.children}
//                 </div>
//             )} />
//         )
//     }
// }

export default props => (
    <StaticQuery
        query={graphql`
        query {
            site {
            siteMetadata {
                title
            }
            }
        }
        `
        }
        render={data => (
        <div style={{ margin: `3rem auto`, maxWidth: 600 }}>

        <Helmet>
          <meta charSet="utf-8" />
          <title>Default</title>
        </Helmet>
            {data.site.siteMetadata.title}
            <Header headerText={props.headerText}/>
            {props.children}
        </div>
    )} />
)

