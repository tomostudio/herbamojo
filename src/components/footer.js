import React from 'react';
import { Link } from 'gatsby';
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
				<a className="svg" target="_blank" rel="noopener noreferrer" href="https://instagram.com/herbamojo">
					<InstagramSVG />
				</a>
				<a className="svg" target="_blank" rel="noopener noreferrer" href="https://instagram.com/herbamojo">
					<WhatsappSVG />
				</a>
				<a className="svg" target="_blank" rel="noopener noreferrer" href="https://instagram.com/herbamojo">
					<EmailSVG />
				</a>
			</div>
		</div>
	</section>
);
