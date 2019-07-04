import React from 'react';
import { Link } from 'gatsby';
import InstagramImg from 'images/symbols/instagram.svg';
import WhatsAppImg from 'images/symbols/whatsapp.svg';
import EmailImg from 'images/symbols/email.svg';

export default (props) => (
	<section className="footer">
		<div className="wrapper">
			<div className="hidden">
				<Link to="/">HOME</Link>
				<Link to="/">JOURNAL</Link>
			</div>
			<div>
				<a href="https://instagram.com/herbamojo">
					<img src={InstagramImg} alt="herbamojo" />
				</a>
				<a href="https://instagram.com/herbamojo">
					<img src={WhatsAppImg} alt="herbamojo" />
				</a>
				<a href="https://instagram.com/herbamojo">
					<img src={EmailImg} alt="herbamojo" />
				</a>
			</div>
		</div>
	</section>
);
