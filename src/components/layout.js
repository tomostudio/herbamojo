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
				render={(data) => {
					const seo = {
						desc: '',
						keywords: '',
						image: '',
						url: 'https://gemasemesta.co'
					};
					const webname = data.site.siteMetadata.title;
					return (
						<div>
							<Helmet>
								<title>{props.titleText ? `${props.titleText} | ${webname}` : webname}</title>
								<meta name="description" content={seo.desc} />
								<meta name="image" content={seo.image} />
								<meta name="keywords" content={seo.keywords} />
								{seo.url && <meta property="og:url" content={seo.url} />}

								{props.titleText ? (
									<meta property="og:title" content={`${props.titleText} | ${webname}`} />
								) : (
									<meta property="og:title" content={webname} />
								)}
								{seo.desc && <meta property="og:description" content={seo.desc} />}
								{seo.image && <meta property="og:image" content={seo.image} />}
								<meta name="twitter:card" content="summary_large_image" />

								{props.titleText ? (
									<meta property="twitter:title" content={`${props.titleText} | ${webname}`} />
								) : (
									<meta property="twitter:title" content={webname} />
								)}
								{seo.desc && <meta name="twitter:description" content={seo.desc} />}
								{seo.image && <meta name="twitter:image" content={seo.image} />}
							</Helmet>
							<div>{data.site.siteMetadata.title}</div>
							<Header headerText={props.headerText} />
							{props.children}
						</div>
					);
				}}
			/>
		);
	}
}
