import React from 'react';
import Layout from 'components/layout';
import Footer from 'components/footer';
import JournalHeader from 'components/journalheader';
import { Link, graphql } from 'gatsby';

//UTILS
import { LoaderClass } from 'utils/loader';
import { DisableScroll } from 'utils/disablescroll';

import { Arrow } from 'svg/symbols.js';

export default class Journal extends React.Component {
  LangID = true;
  MainID = `journallistid`;
  disableScrollBody = null;
  JournalLoader = new LoaderClass({
    parent: `#${this.MainID}`,
    default_delay: 250,
    postload: () => {
      console.log('postload id');
      if (typeof document !== `undefined`) {
        document.body.classList.add('loaded');
      }
      if (this.disableScrollBody !== null) this.disableScrollBody.enable();
    }
  });
  componentDidMount() {
    console.log('mount id');
    if (typeof document !== `undefined`) {
      document.body.classList.remove('loaded');
      if (this.LangID) {
        document.querySelector('html').setAttribute('lang', 'id');
      } else {
        document.querySelector('html').setAttribute('lang', 'en');
      }
    }
    this.JournalLoader.mountload();

    if (!document.body.classList.contains('loaded')) {
      //DISABLE SCROLL ON MAIN WINDOW
      this.disableScrollBody = new DisableScroll();
    }
  }
  componentWillUnmount() {
    console.log('unmount id');
    if (this.disableScrollBody !== null) {
      this.disableScrollBody.enable();
      this.disableScrollBody = null;
    }
  }
  render() {
    console.log('render id');
    this.JournalLoader.renderload();
    const journals = this.props.data.journals;

    // SET URL
    const curURL = this.props.pageContext.slug.toString();
    let normalaltlinks = false;
    if (this.props.pageContext.index > this.props.pageContext.alttotal - 1) {
      normalaltlinks = true;
    }
    
    let englishURL, indonesianURL;
    let rawjournalurl = this.props.data.general.frontmatter.journalslug;
    if (rawjournalurl.substring(0, 1) !== '/') {
      rawjournalurl = `/${rawjournalurl}`;
    }
    if (curURL.substring(0, 3) === '/id') {
      //ON ID
      indonesianURL = curURL;
      englishURL = curURL.substring(3);
      if(normalaltlinks){
        englishURL = rawjournalurl;
      }
    } else {
      //ON EN
      let _u = curURL;
      if (_u.substring(0, 1) !== '/') {
        _u = `/${_u}`;
      }
      englishURL = _u;
      indonesianURL = `/id${_u}`;
      if(normalaltlinks){
        indonesianURL = `/id${rawjournalurl}`;
      }
    }

    const context = this.props.pageContext;
    let prevurl, nexturl;
    const curindex = context.index + 1;
    if (curindex > 1) {
      let _previndex = curindex - 1;
      if (_previndex === 1) {
        prevurl = `/${rawjournalurl}`;
      } else {
        prevurl = `/${rawjournalurl}/${_previndex}`;
      }
    } else {
      prevurl = '/';
    }

    if (curindex < context.total) {
      let _nextindex = curindex + 1;
      nexturl = `/${rawjournalurl}/${_nextindex}`;
    } else {
      nexturl = '/';
    }

    return (
      <Layout
        mainClass='journal list'
        indonesia={this.LangID}
        mainID={this.MainID}
      >
        <JournalHeader
          indonesia={this.LangID}
          urltarget={englishURL}
          urltargetid={indonesianURL}
          journallist={true}
        />
        <div className='contentWrapper'>
          <section className='mobileTitleSection'>
            <div className='wrapper'>
              <h1>
                {this.LangID
                  ? this.props.data.general.frontmatter.navigation.journal.id
                  : this.props.data.general.frontmatter.navigation.journal.en}
              </h1>
            </div>
          </section>
          <section className='journallist'>
            <div className='wrapper'>
              <div className='__journalcontainer'>
                {journals.edges.map((journal, id) => {
                  return (
                    <Link
                      key={journal.node.id}
                      to={journal.node.fields.slug}
                      className={
                        journal.node.frontmatter.listcolorblack ? 'black' : ''
                      }
                    >
                      <div>
                        <span>{journal.node.frontmatter.date}</span>
                        <h2>{journal.node.frontmatter.title}</h2>
                      </div>
                      <picture>
                        <source
                          srcSet={journal.node.frontmatter.thumbimage}
                          type='image/jpeg'
                        />
                        <img
                          src={journal.node.frontmatter.thumbimage}
                          alt='Herbamojo'
                        />
                      </picture>
                    </Link>
                  );
                })}
              </div>
              {context.total > 1 && (
                <div className='__navcontainer'>
                  <Link
                    to={prevurl}
                    className={context.index === 0 ? 'disable' : ''}
                  >
                    <Arrow />
                  </Link>
                  <Link
                    to={nexturl}
                    className={
                      context.index === context.total - 1 ? 'disable' : ''
                    }
                  >
                    <Arrow />
                  </Link>
                </div>
              )}
            </div>
          </section>
        </div>
        <Footer />
      </Layout>
    );
  }
}

export const query = graphql`
  query($skip: Int!, $limit: Int!, $indo: Boolean!) {
    general: markdownRemark(
      frontmatter: {
        issetting: { eq: true }
        contenttype: { eq: "general_setting" }
      }
    ) {
      frontmatter {
        journalslug
        navigation {
          journal {
            en
            id
          }
        }
      }
    }
    journals: allMarkdownRemark(
      filter: {
        frontmatter: {
          issetting: { eq: false }
          contenttype: { eq: "journal" }
          indonesia: { eq: $indo }
          active: { eq: true }
        }
      }
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD/MM/YY")
            listcolorblack
            thumbimage
          }
          fields {
            slug
          }
          excerpt
        }
      }
    }
  }
`;
