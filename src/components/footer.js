import React from 'react';
import { Link } from 'gatsby';
import InstagramImg from 'images/symbols/instagram.svg';
import WhatsAppImg from 'images/symbols/whatsapp.svg';
import EmailImg from 'images/symbols/email.svg';
import InstagramSVG from 'svg/instagram.js';
import EmailSVG from 'svg/email.js';
import WhatsappSVG from 'svg/whatsapp.js';

export default (props) => (
	<section className="footer">
		<div className="wrapper">
			<div className="">
				<Link to="/">HOME</Link>
				<Link to="/">JOURNAL</Link>
			</div>
			<div>
				<a className="svg" href="https://instagram.com/herbamojo">
					<InstagramSVG />
					{/* <img src={InstagramImg} alt="herbamojo" /> */}
				</a>
				<a className="svg" href="https://instagram.com/herbamojo">
					<WhatsappSVG />
					{/* <img src={WhatsAppImg} alt="herbamojo" /> */}
				</a>
				<a className="svg" href="https://instagram.com/herbamojo">
					<EmailSVG />
					{/* <img src={EmailImg} alt="herbamojo" /> */}
				</a>
			</div>
		</div>
	</section>
);
