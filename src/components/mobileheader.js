import React from 'react';
import { Link } from 'gatsby';
import HerbamojoLogo from 'images/symbols/herbamojologo.svg';

export default class Footer extends React.Component {
	render() {
		return (
			<div id="MobileHeader">
				<Link to={this.props.indonesia ? '/' : '/id'}>
					<span className={`${!this.props.indonesia && 'disable'}`}>EN</span>
					<span className={`${this.props.indonesia && 'disable'}`}>ID</span>
				</Link>
				<Link to={this.props.indonesia ? '/id' : '/'} className="logo">
					<img src={HerbamojoLogo} alt="herbamojo" />
				</Link>
			</div>
		);
	}
}
