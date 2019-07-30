import React from 'react';
import { Link } from 'gatsby';
import HerbamojoLogo from 'images/symbols/herbamojologo.svg';

export default class JournalHeader extends React.Component {
  render() {
    //SET ENGLISH URL
    let urltarget = this.props.urltarget.toString() || '';
    // ALWAY CHECK IF / IS THE FIRST CHARACTER
    if (urltarget.substring(0, 1) === '/') {
      urltarget = `/${urltarget}`;
    }

    if (urltarget.substring(0, 3) === '/id') {
      urltarget = urltarget.substring(3);
    }
    let urltargetid = `/id${urltarget}`;

    if (this.props.urltargetid !== undefined && this.props.urltargetid !== null && this.props.urltargetid !== '') {
      urltargetid = this.props.urltargetid;
    }

    return (
      <div id='JournalHeader'>
        <Link
          aria-label='Language Toggle'
          to={this.props.indonesia ? `${urltarget}` : `${urltargetid}`}
        >
          <span className={`${!this.props.indonesia && 'disable'}`}>EN</span>
          <span className={`${this.props.indonesia && 'disable'}`}>ID</span>
        </Link>
        <Link
          aria-label='Herbamojo Main Page'
          to={this.props.indonesia ? '/id' : '/'}
          className='logo'
        >
          <img src={HerbamojoLogo} alt='herbamojo' />
        </Link>
      </div>
    );
  }
}
