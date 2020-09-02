import React from 'react';
import { StaticQuery, graphql, Link } from 'gatsby';
import InstagramSVG from 'svg/instagram.js';
import EmailSVG from 'svg/email.js';
import WhatsappSVG from 'svg/whatsapp.js';

export default class Footer extends React.Component {
  render() {
    return (
      <StaticQuery
        query={footerQuery}
        render={data => {
          const footerData = data.general.frontmatter.footer;
          const navigation = data.general.frontmatter.navigation;

          if (typeof footerData.wa_no === 'string') {
            footerData.wa_no = footerData.wa_no.replace('+', '');
          }

          let journalslug = data.general.frontmatter.journalslug;
          if (journalslug.substring(0, 1) !== '/') {
            journalslug = `/${journalslug}`;
          }

          return (
            <section className='footer'>
              <div className='wrapper'>
                {!data.general.frontmatter.journaldisable && (
                  <div>
                    <Link
                      aria-label='Home'
                      to={this.props.indonesia ? `/id` : `/`}
                    >
                      {this.props.indonesia
                        ? navigation.home.id
                        : navigation.home.en}
                    </Link>
                    <Link
                      aria-label='Journal'
                      to={this.props.indonesia ? `/id${journalslug}` : `${journalslug}`}
                    >
                      {this.props.indonesia
                        ? navigation.journal.id
                        : navigation.journal.en}
                    </Link>
                  </div>
                )}
                <div>
                  {footerData.ig_link !== '' && (
                    <a
                      className='svg btn-instagram'
                      target='_blank'
                      rel='noopener noreferrer'
                      href={footerData.ig_link}
                      aria-label='Instagram'
                    >
                      <InstagramSVG />
                    </a>
                  )}

                  {footerData.wa_no !== '' && (
                    <a
                      className='svg btn-wa'
                      target='_blank'
                      rel='noopener noreferrer'
                      href={`https://api.whatsapp.com/send?phone=${
                        footerData.wa_no
                      }`}
                      aria-label='Whatsapp'
                    >
                      <WhatsappSVG />
                    </a>
                  )}
                  {footerData.email !== '' && (
                    <a
                      className='svg btn-email'
                      target='_blank'
                      rel='noopener noreferrer'
                      href={`mailto:${footerData.email}`}
                      aria-label='Email'
                    >
                      <EmailSVG />
                    </a>
                  )}
                </div>
              </div>
            </section>
          );
        }}
      />
    );
  }
}

const footerQuery = graphql`
  query FooterQuery {
    general: mdx(
      frontmatter: {
        issetting: { eq: true }
        contenttype: { eq: "general_setting" }
      }
    ) {
      frontmatter {
        journaldisable
        journalslug
        footer {
          email
          ig_link
          wa_no
        }
        navigation {
          home {
            en
            id
          }
          journal {
            en
            id
          }
        }
      }
    }
  }
`;
