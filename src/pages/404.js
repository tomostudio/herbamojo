import React from 'react';
import Layout from 'components/layout';
import Footer from 'components/footer';
import { StaticQuery, graphql, Link } from 'gatsby';
import { HerbamojoLogo } from 'svg/symbols.js';

//UTILS
import { LoaderClass } from 'utils/loader';
import { DisableScroll } from 'utils/disablescroll';
import BottleImg from 'images/static/herbamojo_productshot.png';
import BottleImgWebP from 'images/static/herbamojo_productshot.webp';

export default class Journal extends React.Component {
  MainID = `ErrorPage`;
  disableScrollBody = null;
  ErrorLoader = new LoaderClass({
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
      <StaticQuery
        query={errorQuery}
        render={data => {
          return (
            <Layout mainClass='error' indonesia={false} mainID={this.MainID}>
              <section>
                <div className='wrapper'>
                  <div>
                    <Link to='/' aria-label='Shop Slider'>
                      <HerbamojoLogo />
                    </Link>
                  </div>
                  <div>
                    <span>404</span>
                    <span>{data.general.frontmatter.errortranslation.errortext}</span>
                  </div>
                  <div>
                    <picture>
                      <source srcSet={BottleImgWebP} type='image/webp' />
                      <source srcSet={BottleImg} type='image/jpeg' />
                      <img src={BottleImg} alt='Herbamojo' />
                    </picture>
                  </div>
                </div>
              </section>
              <Footer indonesia={false} />
            </Layout>
          );
        }}
      />
    );
  }
}

const errorQuery = graphql`
  query {
    general: mdx(
      frontmatter: {
        issetting: { eq: true }
        contenttype: { eq: "general_setting" }
      }
    ) {
      frontmatter {
        errortranslation {
          errortext
        }
      }
    }
  }
`;
