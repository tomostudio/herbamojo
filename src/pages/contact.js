import React from "react"
import Layout from "components/layout"


export default ({location}) => (
  <Layout headerText="Contact" location={location}>
    <h1>I'd love to talk! Email me at the address below</h1>
    <p>
      <a href="mailto:me@example.com">me@example.com</a>
    </p>
  </Layout>
)
