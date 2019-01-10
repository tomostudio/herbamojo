import React from "react"
import Layout from "components/layout"

export default class About extends React.Component {
    componentDidMount(){
        console.log('about mount');
    }
    render() {
        return (
        <Layout headerText="About">
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
