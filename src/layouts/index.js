import React from 'react';
import Transition from 'components/transition';

const Layout = ({ children, location }) => (
	<div id="MainLayout">
		<Transition location={location}>{children}</Transition>
	</div>
);

export default Layout;
