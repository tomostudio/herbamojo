import React from 'react';
import Layout from 'components/layout';
import Footer from 'components/footer';
import JournalHeader from 'components/journalheader';
import { Link, graphql } from 'gatsby';
import { Helmet } from 'react-helmet';

//UTILS
import { LoaderClass } from 'utils/loader';
import { DisableScroll } from 'utils/disablescroll';

import Placeholder from 'images/static/herbamojo-bg1.jpg';

export default class Journal extends React.Component {
  LangID = this.props.data.content.frontmatter.indonesia || false;
  MainID = `journal${this.props.data.content.id}`;
  disableScrollBody = null;
  JournalLoader = new LoaderClass({
    parent: `#${this.MainID}`,
    default_delay: 250,
    postload: () => {
      if (typeof window !== undefined) {
        window.scroll(0, 0);
      }
      if (typeof document !== `undefined`) {
        document.body.classList.add('loaded');
      }
      if (this.disableScrollBody !== null) this.disableScrollBody.enable();
    }
  });
  componentDidMount() {
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
    if (this.disableScrollBody !== null) {
      this.disableScrollBody.enable();
      this.disableScrollBody = null;
    }
  }
  render() {
    this.JournalLoader.renderload();
    const content = this.props.data.content.frontmatter;
    const general = this.props.data.general.frontmatter;
    const journals = this.props.data.journals;

    const curURL = this.props.pageContext.slug.toString();
    let englishURL, indonesianURL;

    if (curURL.substring(0, 3) === '/id') {
      // INDONESIAN URL
      englishURL = curURL.substring(3);
      indonesianURL = curURL;
      if (content.altslug !== null && content.altslug !== '') {
        let _au = content.altslug;
        if (_au.substring(0, 1) !== '/') {
          _au = `/${_au}`;
        }
        englishURL = `/${general.journalslug}${_au}`;
      }
    } else {
      // ENGLISH URL
      let _u = curURL;
      if (_u.substring(0, 1) !== '/') {
        _u = `/${_u}`;
      }
      englishURL = _u;
      indonesianURL = `/id${_u}`;
      if (content.altslug !== null && content.altslug !== '') {
        let _au = content.altslug;
        if (_au.substring(0, 1) !== '/') {
          _au = `/${_au}`;
        }
        indonesianURL = `/id/${general.journalslug}${_au}`;
      }
    }
    const { next, prev } = this.props.pageContext;

    // GET RELATED DATA
    const alljournals = this.props.data.alljournals;
    let related = [];
    content.related.forEach(_r => {
      const compareslug = _r.relatedslug;
      alljournals.edges.forEach(_j => {
        if (_j.node.frontmatter.slug === _r.relatedslug) {
          // console.log(_r.relatedslug, _j);
          related.push(_j);
        }
      });
    });
    console.log(related);

    return (
      <Layout mainClass='journal' indonesia={this.LangID} mainID={this.MainID}>
        <JournalHeader
          indonesia={this.LangID}
          urltarget={englishURL}
          urltargetid={indonesianURL}
          black={content.headercolorblack}
          journallist={false}
        />
        <div className='sectionWrapper'>
          <section
            className={`journalcover ${
              content.headercolorblack ? 'black' : ''
            }`}
          >
            <div>
              <div>
                <div>{content.date}</div>
                <div>{content.title}</div>
                <Link
                  to={prev === null ? '' : prev}
                  className={prev === null ? 'disable' : ''}
                >
                  {`${
                    this.LangID
                      ? general.journaltranslation.previousjournal.id
                      : general.journaltranslation.previousjournal.en
                  }`}
                </Link>
                <Link
                  to={next === null ? '' : next}
                  className={next === null ? 'disable' : ''}
                >
                  {`${
                    this.LangID
                      ? general.journaltranslation.nextjournal.id
                      : general.journaltranslation.nextjournal.en
                  }`}
                </Link>
              </div>
            </div>
            <picture>
              <source srcSet={content.coverimage} type='image/jpeg' />
              <img src={Placeholder} alt='Herbamojo' />
            </picture>
          </section>
          <section className='content'>
            <div className='wrapper'>{content.title}</div>
          </section>
          {journals.edges.length > 0 && (
            <section className='related journallist'>
              <div className='wrapper'>
                <div className='content'>
                  <h1>
                    {`${
                      this.LangID
                        ? general.journaltranslation.relatedjournal.id
                        : general.journaltranslation.relatedjournal.en
                    }`}
                  </h1>
                  <div className='__journalcontainer'>
                    {related.map((journal, id) => {
                      return (
                        <Link
                          key={journal.node.id}
                          to={journal.node.fields.slug}
                          className={
                            journal.node.frontmatter.listcolorblack
                              ? 'black'
                              : ''
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
                </div>
              </div>
            </section>
          )}
        </div>
        <Footer indonesia={this.LangID} />
      </Layout>
    );
  }
}

export const query = graphql`
  query($slug: String!, $indo: Boolean!) {
    journals: allMarkdownRemark(
      limit: 2
      filter: {
        frontmatter: {
          issetting: { eq: false }
          contenttype: { eq: "journal" }
          active: { eq: true }
          indonesia: { eq: $indo }
        }
        fields: { slug: { ne: $slug } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
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
    alljournals: allMarkdownRemark(
      filter: {
        frontmatter: {
          issetting: { eq: false }
          contenttype: { eq: "journal" }
          active: { eq: true }
          indonesia: { eq: $indo }
        }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD/MM/YY")
            listcolorblack
            thumbimage
            slug
          }
          fields {
            slug
          }
          excerpt
        }
      }
    }
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
        journaltranslation {
          nextjournal {
            en
            id
          }
          previousjournal {
            en
            id
          }
          relatedjournal {
            en
            id
          }
        }
      }
    }
    content: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      id
      frontmatter {
        indonesia
        title
        date(formatString: "DD/MM/YY")
        altslug
        headercolorblack
        coverimage
        related {
          relatedslug
        }
        seo {
          seo_shortdesc
          seo_keywords
          seo_image
        }
      }
    }
  }
`;
