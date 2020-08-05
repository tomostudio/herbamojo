import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import 'stylesheet/main.scss';
import { Helmet } from 'react-helmet';
import maisonMonoBold from 'fonts/MaisonMono-Bold.woff2';
import maisonMonoItalic from 'fonts/MaisonMono-Italic.woff2';
import amarilloUSAF from 'fonts/AmarilloUSAF.woff2';
export default class Layout extends React.Component {
  render() {
    return (
      <StaticQuery
        query={graphql`
          query LayoutQuery {
            mdx(
              frontmatter: {
                issetting: { eq: true }
                contenttype: { eq: "general_setting" }
              }
            ) {
              frontmatter {
                title
                web_name
                seo {
                  seo_keywords
                  seo_shortdesc
                  seo_image {
                    publicURL
                  }
                }
              }
            }
          }
        `}
        render={(data) => {
          const fm_data = data.mdx.frontmatter;
          const web_name = fm_data.web_name;

          let seo_image = '';
          if (fm_data.seo.seo_image) {
            seo_image = `${fm_data.seo.seo_image.publicURL}`;
          }

          const seo = {
            desc: fm_data.seo.seo_shortdesc,
            keywords: fm_data.seo.seo_keywords,
            image: `https://herbamojo.id${seo_image}`,
            url: 'https://herbamojo.id',
          };

          const props = this.props;
          return (
            <main
              className={`${props.mainClass} ${props.indonesia ? `id` : `en`}`}
              id={props.mainID}
            >
              <Helmet>
                <meta charSet='utf-8' />
                <title>
                  {props.titleText
                    ? `${props.titleText} | ${web_name}`
                    : web_name}
                </title>
                <meta name='description' content={seo.desc} />
                <meta name='image' content={seo.image} />
                <meta name='keywords' content={seo.keywords} />
                {seo.url && <meta property='og:url' content={seo.url} />}

                <link
                  rel='prefetch'
                  href={maisonMonoBold}
                  as='font'
                  type='font/woff2'
                  crossorigin
                ></link>
                <link
                  rel='prefetch'
                  href={maisonMonoItalic}
                  as='font'
                  type='font/woff2'
                  crossorigin
                ></link>
                <link
                  rel='prefetch'
                  href={amarilloUSAF}
                  as='font'
                  type='font/woff2'
                  crossorigin
                ></link>

                {props.titleText ? (
                  <meta
                    property='og:title'
                    content={`${props.titleText} | ${web_name}`}
                  />
                ) : (
                  <meta property='og:title' content={web_name} />
                )}
                {seo.desc && (
                  <meta property='og:description' content={seo.desc} />
                )}
                {seo.image && <meta property='og:image' content={seo.image} />}
                <meta name='twitter:card' content='summary_large_image' />

                {props.titleText ? (
                  <meta
                    property='twitter:title'
                    content={`${props.titleText} | ${web_name}`}
                  />
                ) : (
                  <meta property='twitter:title' content={web_name} />
                )}
                {seo.desc && (
                  <meta name='twitter:description' content={seo.desc} />
                )}
                {seo.image && <meta name='twitter:image' content={seo.image} />}
              </Helmet>
              {props.children}
            </main>
          );
        }}
      />
    );
  }
}
