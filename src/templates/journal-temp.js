import React from 'react';
import Layout from 'components/layout';
import Footer from 'components/footer';
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
    default_delay: 500,
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
    const journals = this.props.data.journals;
    return (
      <Layout mainClass='journal' indo={this.LangID} mainID={this.MainID}>
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
    content: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      id
      frontmatter {
        indonesia
        title
        date(formatString: "DD MMMM, YYYY")
        seo {
          seo_shortdesc
          seo_keywords
          seo_image
        }
      }
    }
  }
`;
