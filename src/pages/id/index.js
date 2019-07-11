import React from 'react';
import Layout from 'components/layout';
import Footer from 'components/footer';
import { ScrollSnap } from 'utils/scrollsnap';
import { Scrollax } from 'utils/scrollax';
import { LoaderClass } from 'utils/loader';
import { InViewportClass } from 'utils/inviewport';
// import { MediaCheck } from 'utils/mediacheck';
import { Link } from 'gatsby';
import HerbamojoLogo from 'images/symbols/herbamojologo.svg';

import InstagramSVG from 'svg/instagram.js';
import EmailSVG from 'svg/email.js';
import WhatsappSVG from 'svg/whatsapp.js';

import FirstBG from 'images/static/herbamojo-bg2.jpg';
import SecondBG from 'images/static/herbamojo-bg1.jpg';

import BottleImg from 'images/static/herbamojo_productshot.png';

export default class Home extends React.Component {
	IndexLoader = new LoaderClass({
		parent: '#homeID',
		default_delay: 500,
		postload: () => {
			
			if (typeof document !== `undefined`) {
				document.body.classList.add('loaded');
			}

			this.scrollsnap = ScrollSnap.init({
				sections_identifier: 'main.home section',
				snap_identifier: 'div.overlay .right_nav .snap_nav',
				speed: 500,
				maxduration: 1000,
				responsive_width: 300
			});

			// ScrollSnap.kill();

			this.inview.footer = new InViewportClass({
				target: 'section.footer',
				visibility: 0.05,
				enter: () => {
					document.querySelector('div.overlay').classList.add('stuck');
				},
				exit: () => {
					document.querySelector('div.overlay').classList.remove('stuck');
				}
			});

			this.inview.bottlesection = new InViewportClass({
				target: '.bottlesection_wrapper',
				visibility: 0.333,
				enter: () => {
					document.querySelector('div.bottlewrapper').classList.remove('stuck');
				},
				exit: () => {
					document.querySelector('div.bottlewrapper').classList.add('stuck');
				}
			});

			this.inview.home = new InViewportClass({
				target: 'section#home',
				visibility: 0.4,
				enter: () => {
					document.querySelector('#ShopButton').classList.add('hide');
				},
				exit: () => {
					document.querySelector('#ShopButton').classList.remove('hide');
				}
			});

			this.scrollax.one = new Scrollax({ target: 'img.paralax1', scroll_movement: 0.25, alternate_left: true });
			this.scrollax.two = new Scrollax({ target: 'img.paralax2', scroll_movement: 0.25, alternate_right: true });
		}
	});
	inview = {
		footer: null,
		home: null,
		bottlesection: null
	};
	scrollax = {
		one: null,
		two: null
	};
	scrollsnap = null;
	componentDidMount() {
		
		if (typeof document !== `undefined`) {
			document.body.classList.remove('loaded');
		}
		this.IndexLoader.mountload();
	}
	componentWillUnmount() {
		if(this.inview.home)this.inview.home.kill();
		if(this.inview.footer)this.inview.footer.kill();
		if(this.inview.bottlesection)this.inview.bottlesection.kill();
		if(this.scrollax.one)this.scrollax.one.kill();
		if(this.scrollax.two)this.scrollax.two.kill();
		if (this.scrollsnap)this.scrollsnap.kill();
	}
	gotoShop() {
		ScrollSnap.snap.to(4);
	}
	render() {
		this.IndexLoader.renderload();
		return (
			<Layout titleText="Home" mainClass="home indo" mainID="homeID">
				<div className="overlay_wrapper">
					<div className="overlay">
						<div className="wrapper">
							<div>
								<Link to="/">
									EN
								</Link>
								<Link className="disable" to="/id">ID</Link>
							</div>
							{/* NAVIGATION */}
							<div className="right_nav">
								<div className="snap_nav">
									<span>
										<span>HOME</span>
									</span>
									<span className="active">
										<span>ABOUT</span>
									</span>
									<span>
										<span>BENEFITS</span>
									</span>
									<span>
										<span>INGREDIENTS</span>
									</span>
									<span>
										<span>SHOP</span>
									</span>
									{/* <span>
										<span>JOURNAL</span>
									</span> */}
								</div>
								<div className="social_ctn">
									<a
										className="svg"
										target="_blank"
										rel="noopener noreferrer"
										href="https://instagram.com/herbamojo"
									>
										<InstagramSVG />
									</a>
									<a
										className="svg"
										target="_blank"
										rel="noopener noreferrer"
										href="https://instagram.com/herbamojo"
									>
										<WhatsappSVG />
									</a>
									<a
										className="svg"
										target="_blank"
										rel="noopener noreferrer"
										href="https://instagram.com/herbamojo"
									>
										<EmailSVG />
									</a>
								</div>
							</div>
						</div>
					</div>
					{/* CONTENT */}
					<div className="bottlesection_wrapper">
						<div className="greenline" />
						<div className="bottlewrapper">
							<img src={BottleImg} alt="herbamojo" />
							<span id="ShopButton" onClick={this.gotoShop}>
								SHOP
							</span>
						</div>
						<section id="home">
							<div className="wrapper">
								<h1 className="hidden">Herbamojo</h1>
								<span className="logo">
									<img src={HerbamojoLogo} alt="herbamojo" />
								</span>
								INDONESIA
								<div className="content">
									<span>KNOW</span>
									<span>YOUR</span>
									<span>STRENGTH</span>
									<span id="GetButton" onClick={this.gotoShop}>
										GET YOURS NOW
									</span>
								</div>
							</div>
							<div className="bg">
								<img className="paralax1" src={FirstBG} alt="herbamojo" />
							</div>
						</section>
						<section id="about">
							<div className="wrapper">
								<h1>ABOUT</h1>
							</div>
							<div className="bg">
								<img className="paralax2" src={SecondBG} alt="herbamojo" />
							</div>
						</section>
						<section id="benefits">
							<div className="wrapper">
								<h1>BENEFITS</h1>
								<div className="inview" />
							</div>
						</section>
					</div>
					<section id="ingredients">
						<div className="wrapper">
							<h1>Ingredients</h1>
						</div>
					</section>
					<section id="shop">
						<div className="wrapper">
							<h1>SHOP</h1>
						</div>
					</section>
					{/* <section id="journal">
						<div className="wrapper">
							<h1>JOURNAL</h1>
						</div>
					</section> */}
				</div>
				<Footer />
			</Layout>
		);
	}
}
