import React from 'react';
import Layout from 'components/layout';
import Footer from 'components/footer';
import JournalHeader from 'components/journalheader';
import { Link, graphql } from 'gatsby';

//UTILS
import { LoaderClass } from 'utils/loader';
import { DisableScroll } from 'utils/disablescroll';

export default class Journal extends React.Component {
  LangID = true;
  MainID = `journallistid`;
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
    const journals = this.props.data.journals;

    // SET URL
    const curURL = this.props.pageContext.slug.toString();
    let englishURL, indonesianURL;
    if (curURL.substring(0, 3) === '/id') {
      englishURL = curURL.substring(3);
      indonesianURL = curURL;
    } else {
      let _u = curURL;
      if (_u.substring(0, 1) === '/') {
        _u = `/${_u}`;
      }
      englishURL = _u;
      indonesianURL = `/id${_u}`;
    }

    return (
      <Layout mainClass='journal' indo={this.LangID} mainID={this.MainID}>
        <JournalHeader
          indonesia={this.LangID}
          urltarget={englishURL}
          urltargetid={indonesianURL}
        />
        <section>
          journal list indonesia
          <div>
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
  query {
    journals: allMarkdownRemark(
      filter: {
        frontmatter: {
          issetting: { eq: false }
          contenttype: { eq: "journal" }
          indonesia: { eq: true }
          active: { eq: true }
        }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
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
  }
`;
