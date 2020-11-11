import React from 'react';
import { StaticQuery, graphql, Link } from 'gatsby';

import { HerbamojoLogo } from 'svg/symbols.js';

// UTILITIES
import { MediaCheck } from 'utils/mediacheck';

export default class PageHeader extends React.Component {
  scrollEvent = () => {
    if (typeof window !== `undefined`) {
      const _sp = window.pageYOffset || document.documentElement.scrollTop;
      const PageHeader = document.querySelector('#PageHeader');
      let headerTreshold = 100;
      if (MediaCheck.width.mobile()) {
        headerTreshold = 80;
      }
      //CHECK SCROLl
      if (_sp > headerTreshold) {
        if (!PageHeader.classList.contains('stuck'))
          PageHeader.classList.add('stuck');
      } else {
        PageHeader.classList.remove('stuck');
      }
    }
  };
  componentWillUnmount() {
    if (typeof window !== `undefined`) {
      window.removeEventListener('scroll', this.scrollEvent, false);
    }
  }
  render() {
    if (typeof document !== `undefined`) {
      window.addEventListener('scroll', this.scrollEvent, false);
    }
    //SET ENGLISH URL
    let urltarget = this.props.urltarget.toString() || '';
    // ALWAY CHECK IF / IS THE FIRST CHARACTER
    if (urltarget.substring(0, 1) !== '/') {
      urltarget = `/${urltarget}`;
    }

    if (urltarget.substring(0, 3) === '/id') {
      urltarget = urltarget.substring(3);
    }
    let urltargetid = `/id${urltarget}`;

    if (
      this.props.urltargetid !== undefined &&
      this.props.urltargetid !== null &&
      this.props.urltargetid !== ''
    ) {
      urltargetid = this.props.urltargetid;
    }

    const blackcolor = this.props.black || false;
    const onjournalpage = this.props.journal || false;
    const hidetitle = this.props.hidetitle || false;
    const alwaystransparent = this.props.alwaystransparent || false;
    return (
      <StaticQuery
        query={headerQuery}
        render={(data) => {
          const headertitle = this.props.headertitle || {
            id: 'INDONESIA',
            en: 'ENGLISH',
          };
          return (
            <div id='PageHeader' className={`${onjournalpage ? '' : 'list'} ${alwaystransparent ? 'transparent' : ''}`}>
              <div className={`wrapper ${blackcolor ? 'black' : ''}`}>
                <Link
                  aria-label='Language Toggle'
                  to={this.props.indonesia ? `${urltarget}` : `${urltargetid}`}
                >
                  <span className={`${!this.props.indonesia && 'disable'}`}>
                    EN
                  </span>
                  <span className={`${this.props.indonesia && 'disable'}`}>
                    ID
                  </span>
                </Link>
                {!hidetitle ? (onjournalpage ? (
                  <Link
                    aria-label='Back to Journal'
                    to={
                      this.props.indonesia
                        ? `/id/${data.general.frontmatter.journalslug}`
                        : `/${data.general.frontmatter.journalslug}`
                    }
                  >
                    {`${
                      !this.props.indonesia
                        ? data.general.frontmatter.journaltranslation
                            .journalbacktext.en
                        : data.general.frontmatter.journaltranslation
                            .journalbacktext.id
                    }`}
                  </Link>
                ) : (
                  <div>
                    {`${this.props.indonesia ? headertitle.id : headertitle.en}`}
                  </div>
                )) : ''}
                <Link
                  aria-label='Herbamojo Main Page'
                  to={this.props.indonesia ? '/id' : '/'}
                  className='logo'
                >
                  <HerbamojoLogo />
                </Link>
              </div>
            </div>
          );
        }}
      />
    );
  }
}

const headerQuery = graphql`
  query HeaderQuery {
    general: mdx(
      frontmatter: {
        issetting: { eq: true }
        contenttype: { eq: "general_setting" }
      }
    ) {
      frontmatter {
        journaldisable
        journalslug
        journaltranslation {
          journalbacktext {
            en
            id
          }
        }
      }
    }
  }
`;
