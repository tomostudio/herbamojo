import React from 'react';
import Layout from 'components/layout';
import Footer from 'components/footer';
import { Link, graphql } from 'gatsby';

//UTILS
import { LoaderClass } from 'utils/loader';
import { DisableScroll } from 'utils/disablescroll';

export default class Journal extends React.Component {
  MainID = `ErrorPage`;
  disableScrollBody = null;
  ErrorLoader = new LoaderClass({
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
      document.querySelector('html').setAttribute('lang', 'en');
    }
    this.ErrorLoader.mountload();

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
    this.ErrorLoader.renderload();
    return (
      <Layout mainClass='error' indonesia={false} mainID={this.MainID}>
        <section>
          <div className='wrapper'>Error</div>
        </section>
				<Footer indonesia={false}/>
      </Layout>
    );
  }
}

export const query = graphql`
  query {
    general: markdownRemark(
      frontmatter: {
        issetting: { eq: true }
        contenttype: { eq: "general_setting" }
      }
    ) {
      frontmatter {
        web_name
        journaldisable
        errortext
      }
    }
  }
`;
