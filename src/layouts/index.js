import React from 'react';
import Transition from 'components/transition';
import { ResponsiveVH } from 'utils/responsivevh';

class Loader extends React.Component {
	loaderVH = null;
	render() {
		this.loaderVH = new ResponsiveVH({ target: '#LoaderWrapper' });
		return (
			<div id="LoaderWrapper">
				<div />
				<div>LOADING</div>
			</div>
		);
	}
}
const Layout = ({ children, location }) => (
	<div id="MainLayout">
		<Loader />
		<Transition location={location}>{children}</Transition>
	</div>
);

export default Layout;
