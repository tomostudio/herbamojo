import React from "react"
import Layout from "components/layout"
import { Helmet } from "react-helmet"

export default ({location}) => (
    <Layout headerText="Home" location={location}>
        <Helmet>
          <meta charSet="utf-8" />
          <title>HomePage</title>
        </Helmet>
    </Layout>
)
