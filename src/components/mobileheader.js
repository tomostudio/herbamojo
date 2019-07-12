import React from 'react';
import { Link } from 'gatsby';
import HerbamojoLogo from 'images/symbols/herbamojologo.svg';

export default class Footer extends React.Component {
	render() {
		return (
			<div id="MobileHeader">
				<div>
					<Link className={`${!this.props.indonesia && 'disable'}`} to="/">
						EN
					</Link>
					<Link className={`${this.props.indonesia && 'disable'}`} to="/id">ID</Link>
				</div>
				<Link to={this.props.indonesia ? '/id' : '/'} className="logo">
					<img src={HerbamojoLogo} alt="herbamojo" />
				</Link>
			</div>
		);
	}
}
