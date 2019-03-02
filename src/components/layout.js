import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import Header from 'components/header';
import 'stylesheet/main.scss';
import { Helmet } from 'react-helmet';
// import PageTransition from 'gatsby-plugin-page-transitions';

export default class Layout extends React.Component {
	render() {
		const props = this.props;
		return (
			<StaticQuery
				query={graphql`
					query {
						site {
							siteMetadata {
								title
							}
						}
					}
				`}
				render={(data) => (
					// <PageTransition>
					<div style={{ margin: `3rem auto`, maxWidth: 600 }}>
						<Helmet>
							<meta charSet="utf-8" />
							<title>Default</title>
						</Helmet>
						{data.site.siteMetadata.title}
						<Header headerText={props.headerText} />
						{props.children}
					</div>
					// </PageTransition>
				)}
			/>
		);
	}
}
