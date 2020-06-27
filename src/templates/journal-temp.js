import React from 'react';
import Layout from 'components/layout';
import Footer from 'components/footer';
import JournalHeader from 'components/journalheader';
import { Link, graphql } from 'gatsby';
import { Helmet } from 'react-helmet';

//UTILS
import { LoaderClass } from 'utils/loader';
import { DisableScroll } from 'utils/disablescroll';
import { InViewportClass } from 'utils/inviewport';

import { ArrowDouble } from 'svg/symbols.js';

export default class Journal extends React.Component {
  LangID = this.props.data.content.frontmatter.indonesia || false;
  MainID = `journal${this.props.data.content.id}`;
  disableScrollBody = null;
  inviewArray = [];
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

      this.inviewArray[0] = new InViewportClass({
        target: 'section#MobileNav',
        visibility: 0.75,
        enter: () => {
          document.querySelector('section#MobileNav').classList.add('inview');
        },
        exit: () => {
          document
            .querySelector('section#MobileNav')
            .classList.remove('inview');
        },
      });

      this.inviewArray[1] = new InViewportClass({
        target: 'section#Related',
        visibility: 0.55,
        enter: () => {
          document.querySelector('section#Related').classList.add('inview');
        },
        exit: () => {
          document.querySelector('section#Related').classList.remove('inview');
        },
      });
    },
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

    this.inviewArray.forEach((each, index) => {
      if (
        this.inviewArray[index] !== null &&
        this.inviewArray[index] !== undefined
      ) {
        this.inviewArray[index].kill();
        this.inviewArray[index] = null;
      }
    });
  }
  render() {
    this.JournalLoader.renderload();
    const content = this.props.data.content.frontmatter;
    const general = this.props.data.general.frontmatter;
    const journals = this.props.data.journals;
    // const seo = general.seo;

    const seo = {
      desc: content.seo.seo_shortdesc,
      keywords: content.seo.seo_keywords,
    };

    if (content.seo.seo_image !== '' && content.seo.seo_image !== undefined) {
      seo.image = `https://herbamojo.id${content.seo.seo_image}`;
    }

    const curURL = this.props.pageContext.slug.toString();
    let englishURL, indonesianURL;

    console.log(content.altslug);

    if (curURL.substring(0, 3) === '/id') {
      // INDONESIAN URL
      englishURL = curURL.substring(3);
      indonesianURL = curURL;
      if (
        content.altslug !== null &&
        content.altslug !== '' &&
        content.altslug !== '/'
      ) {
        let _au = content.altslug;
        if (_au.substring(0, 1) !== '/') {
          _au = `/${_au}`;
        }
        englishURL = `/${general.journalslug}${_au}`;
      } else {
        englishURL = `/${general.journalslug}`;
      }
    } else {
      // ENGLISH URL
      let _u = curURL;
      if (_u.substring(0, 1) !== '/') {
        _u = `/${_u}`;
      }
      englishURL = _u;
      indonesianURL = `/id${_u}`;

      if (
        content.altslug !== null &&
        content.altslug !== '' &&
        content.altslug !== '/'
      ) {
        let _au = content.altslug;
        if (_au.substring(0, 1) !== '/') {
          _au = `/${_au}`;
        }
        indonesianURL = `/id/${general.journalslug}${_au}`;
      } else {
        indonesianURL = `/id/${general.journalslug}`;
      }
      // console.log(indonesianURL);
    }

    const { next, prev } = this.props.pageContext;
    let onlyarticle = false;
    if ((next === null) & (prev === null)) {
      onlyarticle = true;
    }

    // GET RELATED DATA
    const alljournals = this.props.data.alljournals;
    let related = [];
    if (content.related && content.related.length > 0) {
      content.related.forEach((_r) => {
        if (_r.relatedslug !== '/' && _r.relatedslug !== '') {
          const compareslug = _r.relatedslug;
          alljournals.edges.forEach((_j) => {
            if (_j.node.frontmatter.slug === _r.relatedslug) {
              // console.log(_r.relatedslug, _j);
              related.push(_j);
            }
          });
        }
      });
    }

    return (
      <Layout mainClass='journal' indonesia={this.LangID} mainID={this.MainID}>
        {seo && (
          <Helmet>
            {seo.desc && <meta property='og:description' content={seo.desc} />}
            {seo.desc && <meta name='description' content={seo.desc} />}
            {seo.desc && <meta name='twitter:description' content={seo.desc} />}
            {seo.keywords && <meta name='keywords' content={seo.keywords} />}
            {seo.image && <meta name='image' content={seo.image} />}
            {seo.image && <meta property='og:image' content={seo.image} />}
            {seo.image && <meta name='twitter:image' content={seo.image} />}
          </Helmet>
        )}
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
                {prev === null ? (
                  <a className='navigation disable'>
                    {`${
                      this.LangID
                        ? general.journaltranslation.previousjournal.id
                        : general.journaltranslation.previousjournal.en
                    }`}
                  </a>
                ) : (
                  <Link to={prev} className='navigation'>
                    {`${
                      this.LangID
                        ? general.journaltranslation.previousjournal.id
                        : general.journaltranslation.previousjournal.en
                    }`}
                  </Link>
                )}
                {next === null ? (
                  <a className='navigation disable'>
                    {`${
                      this.LangID
                        ? general.journaltranslation.nextjournal.id
                        : general.journaltranslation.nextjournal.en
                    }`}
                  </a>
                ) : (
                  <Link to={next} className='navigation'>
                    {`${
                      this.LangID
                        ? general.journaltranslation.nextjournal.id
                        : general.journaltranslation.nextjournal.en
                    }`}
                  </Link>
                )}
              </div>
            </div>
            <picture>
              <source srcSet={content.coverimage} type='image/jpeg' />
              <img src={content.coverimage} alt='Herbamojo' />
            </picture>
          </section>
          <section className='markupcontent'>
            <div className='wrapper'>
              <div
                className='markupstyle'
                dangerouslySetInnerHTML={{
                  __html: this.props.data.content.html,
                }}
              />
            </div>
          </section>
          {!onlyarticle && (
            <section id='MobileNav' className='mobileJournalNavigation'>
              <div className='wrapper'>
                <Link
                  to={prev === null ? '' : prev}
                  className={prev === null ? 'disable' : ''}
                >
                  <ArrowDouble />
                  <span>{`${
                    this.LangID
                      ? general.journaltranslation.previousjournalmobile.id
                      : general.journaltranslation.previousjournalmobile.en
                  }`}</span>
                </Link>
                <Link
                  to={next === null ? '' : next}
                  className={next === null ? 'disable' : ''}
                >
                  <span>{`${
                    this.LangID
                      ? general.journaltranslation.nextjournalmobile.id
                      : general.journaltranslation.nextjournalmobile.en
                  }`}</span>
                  <ArrowDouble />
                </Link>
              </div>
            </section>
          )}
          {related.length > 0 && (
            <section id='Related' className='related journallist'>
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
          nextjournalmobile {
            en
            id
          }
          previousjournalmobile {
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
