import React from 'react';
import Transition from 'components/transition';

const Layout = ({ children, location }) => (
	<div id="MainLayout">
		<div id="LoaderWrapper">
			<div></div>
			<div>LOADING</div>
		</div>
		<Transition location={location}>{children}</Transition>
	</div>
);

export default Layout;
