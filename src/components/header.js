import React from "react"
import { Link } from "gatsby"

const ListLink = props => (
    <li style={{ display: `inline-block`, marginRight: `1rem` }}>
      <Link to={props.to}>{props.children}</Link>
    </li>
  )

export default props => (
    <div>
        <h1 >{props.headerText}</h1>

        <ListLink to="/">Home</ListLink>
        <ListLink to="/about/">About</ListLink>
        <ListLink to="/contact/">Contact</ListLink>
        <ListLink to="/blog/">List</ListLink>
    </div>
)
