import React from 'react';
import { StaticQuery, graphql, Link } from 'gatsby';
import InstagramSVG from 'svg/instagram.js';
import EmailSVG from 'svg/email.js';
import WhatsappSVG from 'svg/whatsapp.js';

export default class Footer extends React.Component {
	render() {
		return (
			<StaticQuery
				query={graphql`
					query FooterQuery {
						markdownRemark(
							frontmatter: { issetting: { eq: true }, contenttype: { eq: "general_setting" } }
						) {
							frontmatter {
								footer {
									email
									ig_link
									wa_no
								}
							}
						}
					}
				`}
				render={(data) => {
					const footerData = data.markdownRemark.frontmatter.footer;
					if (typeof footerData.wa_no === 'string') {
						footerData.wa_no = footerData.wa_no.replace('+', '');
					}

					return (
						<section className="footer">
							<div className="wrapper">
								<div className="">
									<Link to="/">HOME</Link>
									<Link to="/">JOURNAL</Link>
								</div>
								<div>
									{footerData.ig_link !== '' && (
										<a
											className="svg"
											target="_blank"
											rel="noopener noreferrer"
											href={footerData.ig_link}
										>
											<InstagramSVG />
										</a>
									)}

									{footerData.wa_no !== '' && (
										<a
											className="svg"
											target="_blank"
											rel="noopener noreferrer"
											href={`https://api.whatsapp.com/send?phone=${footerData.wa_no}`}
										>
											<WhatsappSVG />
										</a>
									)}
									{footerData.email !== '' && (
										<a
											className="svg"
											target="_blank"
											rel="noopener noreferrer"
											href={`mailto:${footerData.email}`}
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
// export default (props) => (
// 	<section className="footer">
// 		<div className="wrapper">
// 			<div className="">
// 				<Link to="/">HOME</Link>
// 				<Link to="/">JOURNAL</Link>
// 			</div>
// 			<div>
// 				<a className="svg" target="_blank" rel="noopener noreferrer" href="https://instagram.com/herbamojo">
// 					<InstagramSVG />
// 				</a>
// 				<a className="svg" target="_blank" rel="noopener noreferrer" href="https://instagram.com/herbamojo">
// 					<WhatsappSVG />
// 				</a>
// 				<a className="svg" target="_blank" rel="noopener noreferrer" href="https://instagram.com/herbamojo">
// 					<EmailSVG />
// 				</a>
// 			</div>
// 		</div>
// 	</section>
// );
