import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import Transition from 'components/transition';

const Layout = ({ children, location }) => (
	<StaticQuery
		query={graphql`
			query SiteTitleQuery {
				site {
					siteMetadata {
						title
					}
				}
			}
		`}
		render={(data) => (
			<div id="MainLayout">
				<Transition location={location}>{children}</Transition>
			</div>
		)}
	/>
);

export default Layout;
