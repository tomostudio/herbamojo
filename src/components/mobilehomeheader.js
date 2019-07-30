import React from 'react';
import { Link } from 'gatsby';
import HerbamojoLogo from 'images/symbols/herbamojologo.svg';

export default class MobileHomeHeader extends React.Component {
  render() {
    return (
      <div id='MobileHeader'>
        <Link
          aria-label='Language Toggle'
          to={this.props.indonesia ? '/' : '/id'}
        >
          <span className={`${!this.props.indonesia && 'disable'}`}>EN</span>
          <span className={`${this.props.indonesia && 'disable'}`}>ID</span>
        </Link>
        <span
          className='logo'
        >
          <img src={HerbamojoLogo} alt='herbamojo' />
        </span>
      </div>
    );
  }
}
