import React from 'react';
import Layout from 'components/layout';
import Footer from 'components/footer';
import JournalHeader from 'components/journalheader';
import { Link, graphql } from 'gatsby';

//UTILS
import { LoaderClass } from 'utils/loader';
import { DisableScroll } from 'utils/disablescroll';

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
      if(content.altslug !== null && content.altslug !== ''){
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
      if(content.altslug !== null && content.altslug !== ''){
        let _au = content.altslug;
        if (_au.substring(0, 1) !== '/') {
          _au = `/${_au}`;
        }
        indonesianURL = `/id/${general.journalslug}${_au}`;
      }
    }
    return (
      <Layout mainClass='journal' indonesia={this.LangID} mainID={this.MainID}>
        <JournalHeader
          indonesia={this.LangID}
          urltarget={englishURL}
          urltargetid={indonesianURL}
        />
        <section>
          <div className='wrapper'>{content.title}</div>
        </section>
        <section>
          <div className='wrapper'>
            {journals.edges.map((journal, id) => {
              return (
                <Link key={journal.node.id} to={journal.node.fields.slug}>
                  {journal.node.frontmatter.title}
                </Link>
              );
            })}
          </div>
        </section>

        <Footer />
      </Layout>
    );
  }
}

export const query = graphql`
  query($slug: String!) {
    journals: allMarkdownRemark(
      limit: 3
      filter: {
        frontmatter: {
          issetting: { eq: false }
          contenttype: { eq: "journal" }
          active: { eq: true }
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
          }
          fields {
            slug
          }
          excerpt
        }
      }
    }
		general: markdownRemark(frontmatter: { issetting: { eq: true }, contenttype: { eq: "general_setting" } }) {
			frontmatter {
        journalslug
			}
		}
    content: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      id
      frontmatter {
        indonesia
        title
        date(formatString: "DD MMMM, YYYY")
        altslug
        seo {
          seo_shortdesc
          seo_keywords
          seo_image
        }
      }
    }
  }
`;
