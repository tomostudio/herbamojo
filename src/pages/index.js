import React from 'react';
import { StaticQuery, Link, graphql } from 'gatsby';
import Slider from 'react-slick';
//UTILS
import { ScrollSnap } from 'utils/scrollsnap';
import { Scrollax } from 'utils/scrollax';
import { ScrollIt } from 'utils/scrollit';
import { LoaderClass } from 'utils/loader';
import { InViewportClass } from 'utils/inviewport';
import { MediaCheck } from 'utils/mediacheck';
import { ResponsiveVH } from 'utils/responsivevh';

//COMPONENTS
import Layout from 'components/layout';
import Footer from 'components/footer';
import MobileHeader from 'components/mobileheader';

//JS SVG
import InstagramSVG from 'svg/instagram.js';
import EmailSVG from 'svg/email.js';
import WhatsappSVG from 'svg/whatsapp.js';
import { Arrow, ArrowSmaller } from 'svg/symbols.js';

//IMAGES
import HerbamojoLogo from 'images/symbols/herbamojologo.svg';
import BottleImg from 'images/static/herbamojo_productshot.png';

//SVG CERT
import CertBPOM from 'images/symbols/bpom.svg';
import CertNatural from 'images/symbols/natural.svg';
import CertQuality from 'images/symbols/quality.svg';
import CertResearch from 'images/symbols/research.svg';
import CertQuadra from 'images/symbols/quadra.svg';
import CertHalal from 'images/symbols/halal.svg';

//SVG BENEFITS
import BenefitStamina from 'images/symbols/stamina.svg';
import BenefitEnergy from 'images/symbols/energy.svg';
import BenefitImmune from 'images/symbols/immune.svg';
import BenefitExercise from 'images/symbols/exercise.svg';

export default class Home extends React.Component {
	//TOGGLE LANGUAGE
	// --------------
	langID = this.props.langID || false;
	// --------------
	IndexLoader = new LoaderClass({
		parent: `#${this.langID ? 'homeID' : 'homeEN'}`,
		default_delay: 500,
		postload: () => {
			if (typeof document !== `undefined`) {
				document.body.classList.add('loaded');
				window.scroll(0, 0);
			}

			ScrollSnap.init({
				sections_identifier: `main.home#${this.langID ? 'homeID' : 'homeEN'} section`,
				snap_identifier: '',
				speed: 500,
				maxduration: 1000,
				responsive_width: 700,
				responsive_height: 500
			});

			this.snapNav = document.querySelectorAll(
				`main#${this.langID ? 'homeID' : 'homeEN'} div.overlay .right_nav .snap_nav > *`
			);
			const setNav = (i) => {
				this.snapNav.forEach((nav) => {
					nav.classList.remove('active');
				});
				if (i >= 0) {
					this.snapNav[i].classList.add('active');
				}
			};
			setNav(0);

			//SETUP BUTTON
			this.snapNav.forEach((nav, index) => {
				nav.onclick = () => {
					ScrollSnap.snap.to(index);
				};
			});

			this.inview.bottlesection = new InViewportClass({
				target: '.bottlesection_wrapper',
				visibility: 0.332,
				enter: () => {
					document.querySelector('div.bottlewrapper').classList.remove('stuck');
				},
				exit: () => {
					document.querySelector('div.bottlewrapper').classList.add('stuck');
				},
				always: (e) => {
					console.log(e);
				}
			});

			//SECTIONS INVIEW
			this.inview.home = new InViewportClass({
				target: 'section#home',
				visibility: 0.55,
				enter: () => {
					document.querySelector('#ShopButton').classList.add('hide');
					document.querySelector('section#home').classList.add('inview');
					setNav(0);
				},
				exit: () => {
					document.querySelector('section#home').classList.remove('inview');
					document.querySelector('#ShopButton').classList.remove('hide');
				}
			});
			this.inview.about = new InViewportClass({
				target: 'section#about',
				visibility: 0.55,
				enter: () => {
					setNav(1);
					document.querySelector('section#about').classList.add('inview');
				},
				exit: () => {
					document.querySelector('section#about').classList.remove('inview');
				}
			});

			this.inview.benefits = new InViewportClass({
				target: 'section#benefits',
				visibility: 0.55,
				enter: () => {
					setNav(2);
					document.querySelector('section#benefits').classList.add('inview');
				},
				exit: () => {
					document.querySelector('section#benefits').classList.remove('inview');
				}
			});

			this.inview.ingredients = new InViewportClass({
				target: 'section#ingredients',
				visibility: 0.55,
				enter: () => {
					setNav(3);
					document.querySelector('section#ingredients').classList.add('inview');
				},
				exit: () => {
					// document.querySelector('section#ingredients').classList.remove('inview');
				}
			});
			this.inview.shop = new InViewportClass({
				target: 'section#shop',
				visibility: 0.55,
				enter: () => {
					setNav(4);
					document.querySelector('section#shop').classList.add('inview');
				},
				exit: () => {
					document.querySelector('section#shop').classList.remove('inview');
				}
			});

			this.inview.footer = new InViewportClass({
				target: 'section.footer',
				visibility: 0.05,
				enter: () => {
					document.querySelector('div.overlay').classList.add('stuck');
					setNav(-1);
				},
				exit: () => {
					document.querySelector('div.overlay').classList.remove('stuck');
				}
			});

			this.scrollax.one = new Scrollax({ target: 'img.paralax1', move_right: 0.25 });
			this.scrollax.two = new Scrollax({ target: 'img.paralax2', move_left: 0.25 });
			this.scrollax.ing_bg = new Scrollax({ target: '#ing_bg', move_top: 0.35 });
			this.scrollax.home_mobile = new Scrollax({ target: 'img.mobile.prlx', move_bottom: 0.3 });
			this.scrollax.about_mobile = new Scrollax({ target: '#about .content .bottle > img', move_bottom: 0.3 });

			//INGREDIENTS SET
			this.ingredientToggle(document.querySelector('#ing_sel > *:nth-child(1) > div:first-child'));

			// INIT RESIZE
			this.resize();

			this.forceVH = new ResponsiveVH({ target: '.fitheight' });
			this.inview.bottlesection.trigger();
		}
	});
	inview = {
		footer: null,
		home: null,
		about: null,
		benefits: null,
		ingredients: null,
		shop: null,
		bottlesection: null
	};
	scrollax = {
		one: null,
		home_mobile: null,
		two: null,
		ing_bg: null
	};
	snapNav = null;
	scrollsnap = null;
	forceVH = null;
	componentDidMount() {
		if (typeof document !== `undefined`) {
			document.body.classList.remove('loaded');
		}
		this.IndexLoader.mountload();
	}
	componentWillUnmount() {
		if (this.inview.home) this.inview.home.kill();
		if (this.inview.about) this.inview.about.kill();
		if (this.inview.benefits) this.inview.benefits.kill();
		if (this.inview.ingredients) this.inview.ingredients.kill();
		if (this.inview.shop) this.inview.shop.kill();
		if (this.inview.footer) this.inview.footer.kill();
		if (this.inview.bottlesection) this.inview.bottlesection.kill();
		if (this.scrollax.one) this.scrollax.one.kill();
		if (this.scrollax.two) this.scrollax.two.kill();
		if (this.scrollax.ing_bg) this.scrollax.ing_bg.kill();
		if (this.scrollax.home_mobile) this.scrollax.home_mobile.kill();
		// if (ScrollSnap) ScrollSnap.kill();

		document.body.classList.remove('menu_open');
		this.snapNav.forEach((nav, index) => {
			nav.onClick = null;
		});

		if (typeof document !== `undefined`) {
			window.removeEventListener('resize', this.resize, false);
		}
	}
	scrollaxCallibrate() {
		if (this.scrollax.one) this.scrollax.one.trigger();
		if (this.scrollax.two) this.scrollax.two.trigger();
		if (this.scrollax.ing_bg) this.scrollax.ing_bg.trigger();
		if (this.scrollax.home_mobile) this.scrollax.home_mobile.trigger();
	}
	resize() {
		//ADJUST INGREDIENTS DESCRIPTION MOBILE HEIGHT
		const ingDescMobile = document.querySelectorAll('#ing_sel > span > div:last-child > div');
		let height = [];
		ingDescMobile.forEach((desc) => {
			height.push(desc.clientHeight);
			desc.parentNode.style.height = desc.clientHeight.toString() + 'px';
		});
		if (!MediaCheck.width.mobile) {
			document.body.classList.remove('menu_open');
		}
	}
	gotoShop() {
		if (MediaCheck.width.mobile()) {
			const scrollTarget = document.querySelector('section#shop').getBoundingClientRect().top;
			const curScrollPos = window.pageYOffset || document.documentElement.scrollTop;
			const wH =
				window.innerHeight ||
				document.documentElement.clientHeight ||
				document.getElementsByTagName('body')[0].clientHeight;
			const dist = Math.abs(scrollTarget - curScrollPos);
			let duration = dist / wH * 500;
			if (duration < 250) duration = 250;
			if (duration > 1000) duration = 1000;
			ScrollIt(scrollTarget, duration);
		} else {
			ScrollSnap.snap.to(4);
		}
	}
	ingredientChanging = false;
	ingredientChangeTimeout = null;
	ingredientClick(e) {
		this.ingredientToggle(e.currentTarget);
	}
	ingredientToggle(target) {
		if (target != null) {
			const delay = 500;
			let child = target.parentNode;
			let index = 1;
			while ((child = child.previousSibling) != null) index++;
			let change = {
				number: index,
				desc: target.parentNode.dataset.desc
			};

			const displayContainer = document.querySelector('#ing_display');
			const displayNumber = document.querySelector('#ing_display_number');
			const displayDesc = document.querySelector('#ing_display_description');
			const displayBg = document.querySelector('#ing_bg');

			const ingredientsButtons = document.querySelectorAll('#ing_sel > *');
			const ingredientsBg = document.querySelectorAll('#ing_bg > *');

			ingredientsButtons.forEach((btn) => {
				btn.classList.remove('active');
			});

			target.parentNode.classList.add('active');

			if (!this.ingredientChanging) {
				this.ingredientChanging = true;
				displayBg.classList.add('transition');
				displayContainer.classList.add('transition');
			}

			if (this.ingredientChangeTimeout != null) clearTimeout(this.ingredientChangeTimeout);
			this.ingredientChangeTimeout = setTimeout(() => {
				this.ingredientChanging = false;
				displayNumber.innerHTML = change.number;
				displayDesc.innerHTML = change.desc;
				displayContainer.classList.remove('transition');

				ingredientsBg.forEach((bg) => {
					bg.classList.remove('active');
				});
				ingredientsBg[change.number - 1].classList.add('active');

				displayBg.classList.remove('transition');
				this.ingredientChangeTimeout = null;
			}, delay);
		}
	}
	menuToggle() {
		if (typeof document !== `undefined`) {
			if (document.body.classList.contains('menu_open')) {
				document.body.classList.remove('menu_open');
			} else {
				document.body.classList.add('menu_open');
			}
		}
	}
	mobileScroll(e) {
		if (e.currentTarget != null) {
			let child = e.currentTarget;
			let index = 0;
			while ((child = child.previousSibling) != null) index++;
			const sections = document.querySelectorAll('main.home section');
			if (sections != null && sections[index]) {
				const elTop = sections[index].getBoundingClientRect().top;
				const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
				window.scrollTo(0, elTop + scrollTop);
				// ScrollIt(elTop + scrollTop, 50);
				setTimeout(() => {
					this.scrollaxCallibrate();
				}, 10);
				this.menuToggle();
			}
		}
	}
	render() {
		this.IndexLoader.renderload();

		const sliderSettings = {
			infinite: true,
			speed: 500,
			autoplay: false,
			arrows: false,
			slidesToShow: 2,
			slidesToScroll: 1,
			responsive: [
				{
					breakpoint: 800,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1
					}
				}
			]
		};

		if (typeof document !== `undefined`) {
			window.addEventListener('resize', this.resize, false);
		}
		return (
			<StaticQuery
				query={indexQuery}
				render={(data) => {
					const generalData = data.general.frontmatter;
					const homeData = data.home.frontmatter;
					const footerData = generalData.footer;
					const transData = data.home.frontmatter.translations;
					return (
						<Layout
							titleText="Home"
							mainClass="home"
							indo={this.langID}
							mainID={this.langID ? 'homeID' : 'homeEN'}
						>
							<MobileHeader indonesia={this.langID} />
							<div id="MobileNavigation">
								<div>
									<div className="menubutton" onClick={(e) => this.menuToggle(e)}>
										<span />
										<span />
										<span />
									</div>
								</div>
								<div className="fitheight">
									<div>
										<div className="closebutton" onClick={(e) => this.menuToggle(e)}>
											<span />
											<span />
										</div>
									</div>
									<div className="fitheight">
										<span onClick={(e) => this.mobileScroll(e)}>
											{this.langID ? transData.home.title.id : transData.home.title.id}
										</span>
										<span onClick={(e) => this.mobileScroll(e)}>
											{this.langID ? transData.about.title.id : transData.about.title.id}
										</span>
										<span onClick={(e) => this.mobileScroll(e)}>
											{this.langID ? transData.benefits.title.id : transData.benefits.title.id}
										</span>
										<span onClick={(e) => this.mobileScroll(e)}>
											{this.langID ? (
												transData.ingredients.title.id
											) : (
												transData.ingredients.title.id
											)}
										</span>
										<span onClick={(e) => this.mobileScroll(e)}>
											{this.langID ? transData.shop.title.id : transData.shop.title.id}
										</span>
										<span onClick={(e) => this.mobileScroll(e)}>
											{this.langID ? transData.journal.title.id : transData.journal.title.id}
										</span>
										<div>
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
									</div>
								</div>
							</div>
							<div className="overlay_wrapper">
								<div className="overlay">
									<div className="wrapper">
										<div>
											<Link className={`${!this.props.langID && 'disable'}`} to="/">
												EN
											</Link>
											<Link className={`${this.props.langID && 'disable'}`} to="/id">
												ID
											</Link>
										</div>
										{/* NAVIGATION */}
										<div className="right_nav">
											<div className="snap_nav">
												<span>
													<span>
														{this.langID ? (
															transData.home.title.id
														) : (
															transData.home.title.id
														)}
													</span>
												</span>
												<span className="active">
													<span>
														{this.langID ? (
															transData.about.title.id
														) : (
															transData.about.title.id
														)}
													</span>
												</span>
												<span>
													<span>
														{this.langID ? (
															transData.benefits.title.id
														) : (
															transData.benefits.title.id
														)}
													</span>
												</span>
												<span>
													<span>
														{this.langID ? (
															transData.ingredients.title.id
														) : (
															transData.ingredients.title.id
														)}
													</span>
												</span>
												<span>
													<span>
														{this.langID ? (
															transData.shop.title.id
														) : (
															transData.shop.title.id
														)}
													</span>
												</span>
												{/* <span>
										<span>{this.langID ? transData.journal.title.id : transData.journal.title.id }</span>
									</span> */}
											</div>
											<div className="social_ctn">
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
									</div>
								</div>
								{/* CONTENT */}
								<div className="bottlesection_wrapper">
									<div className="greenline" />
									<div className="bottlewrapper">
										<img src={BottleImg} alt="herbamojo" />
										<span id="ShopButton" onClick={this.gotoShop}>
											{this.langID ? transData.home.shopfloat.id : transData.home.shopfloat.en}
										</span>
									</div>
									<section id="home">
										<div className="wrapper">
											<h1 className="hidden">{generalData.web_name}</h1>
											<span className="logo">
												<img src={HerbamojoLogo} alt="herbamojo" />
											</span>
											<div className="content">
												<span>
													{this.langID ? (
														transData.home.kys.id.know
													) : (
														transData.home.kys.en.know
													)}
												</span>
												<span>
													{this.langID ? (
														transData.home.kys.id.your
													) : (
														transData.home.kys.en.your
													)}
												</span>
												<span>
													{this.langID ? (
														transData.home.kys.id.strength
													) : (
														transData.home.kys.en.strength
													)}
												</span>
												<span id="GetButton" onClick={this.gotoShop}>
													{this.langID ? (
														transData.home.getyours.id
													) : (
														transData.home.getyours.en
													)}
												</span>
											</div>
										</div>
										<div className="bg">
											<img className="paralax1" src={homeData.home.background} alt="herbamojo" />
											<img
												className="mobile prlx"
												src={homeData.home.backgroundmobile}
												alt="herbamojo"
											/>
										</div>
									</section>
									<section id="about">
										<div className="wrapper">
											<h1>{this.langID ? transData.about.title.id : transData.about.title.id}</h1>
											<div className="content half">
												<div className="logo">
													<img src={HerbamojoLogo} alt="herbamojo" />
												</div>
												<div className="bottle">
													<img src={BottleImg} alt="herbamojo" />
												</div>
												<div className="description">
													{this.langID ? homeData.about.desc.id : homeData.about.desc.id}
												</div>
												<div className="certification">
													<div>
														<img src={CertNatural} alt="herbamojo" />
														<span>
															{this.langID ? (
																transData.about.cert.natural.id
															) : (
																transData.about.cert.natural.id
															)}
														</span>
													</div>

													<div>
														<img src={CertBPOM} alt="herbamojo" />
														<span>
															{this.langID ? (
																transData.about.cert.bpom.id
															) : (
																transData.about.cert.bpom.id
															)}
														</span>
													</div>

													<div>
														<img src={CertHalal} alt="herbamojo" />
														<span>
															{this.langID ? (
																transData.about.cert.halal.id
															) : (
																transData.about.cert.halal.id
															)}
														</span>
													</div>

													<div>
														<img src={CertQuality} alt="herbamojo" />
														<span>
															{this.langID ? (
																transData.about.cert.quality.id
															) : (
																transData.about.cert.quality.id
															)}
														</span>
													</div>
													<div>
														<img src={CertResearch} alt="herbamojo" />
														<span>
															{this.langID ? (
																transData.about.cert.expert.id
															) : (
																transData.about.cert.expert.id
															)}
														</span>
													</div>

													<div>
														<img src={CertQuadra} alt="herbamojo" />
														<span>
															{this.langID ? (
																transData.about.cert.quadra.id
															) : (
																transData.about.cert.quadra.id
															)}
														</span>
													</div>
												</div>
											</div>
										</div>
										<div className="bg">
											<img className="paralax2" src={homeData.about.background} alt="herbamojo" />
										</div>
									</section>
									<section id="benefits">
										<div className="wrapper">
											<h1>
												{this.langID ? (
													transData.benefits.title.id
												) : (
													transData.benefits.title.id
												)}
											</h1>
											<div className="content half">
												<div>
													<div>
														<img src={BenefitStamina} alt="herbamojo" />
														<div>
															<span>
																{this.langID ? (
																	transData.benefits.stamina.id.line1
																) : (
																	transData.benefits.stamina.en.line1
																)}
															</span>
															<span>
																{this.langID ? (
																	transData.benefits.stamina.id.line2
																) : (
																	transData.benefits.stamina.en.line2
																)}
															</span>
														</div>
													</div>
													<div>
														<img src={BenefitEnergy} alt="herbamojo" />
														<div>
															<span>
																{this.langID ? (
																	transData.benefits.increases.id.line1
																) : (
																	transData.benefits.increases.en.line1
																)}
															</span>
															<span>
																{this.langID ? (
																	transData.benefits.increases.id.line2
																) : (
																	transData.benefits.increases.en.line2
																)}
															</span>
														</div>
													</div>
													<div>
														<img src={BenefitImmune} alt="herbamojo" />
														<div>
															<span>
																{this.langID ? (
																	transData.benefits.immune.id.line1
																) : (
																	transData.benefits.immune.en.line1
																)}
															</span>
															<span>
																{this.langID ? (
																	transData.benefits.immune.id.line2
																) : (
																	transData.benefits.immune.en.line2
																)}
															</span>
														</div>
													</div>
													<div>
														<img src={BenefitExercise} alt="herbamojo" />
														<div>
															<span>
																{this.langID ? (
																	transData.benefits.enhance.id.line1
																) : (
																	transData.benefits.enhance.en.line1
																)}
															</span>
															<span>
																{this.langID ? (
																	transData.benefits.enhance.id.line2
																) : (
																	transData.benefits.enhance.en.line2
																)}
															</span>
														</div>
													</div>
												</div>
											</div>
										</div>
									</section>
								</div>
								<section id="ingredients">
									<div className="wrapper">
										<h1>
											{this.langID ? (
												transData.ingredients.title.id
											) : (
												transData.ingredients.title.id
											)}
										</h1>
										<div className="content">
											<div id="ing_sel">
												{homeData.ingredients.map((node, id) => {
													return (
														<span
															key={id}
															className="active"
															data-desc={this.langID ? node.desc.id : node.desc.en}
														>
															<div onClick={(e) => this.ingredientClick(e)}>
																<span>
																	{this.langID ? node.title.id : node.title.en}
																</span>
																<span>
																	{this.langID ? node.title.id : node.title.en}
																</span>
															</div>
															<div>
																<div>{this.langID ? node.desc.id : node.desc.en}</div>
															</div>
														</span>
													);
												})}
											</div>
											<div>
												<div id="ing_display">
													<div id="ing_display_number">1</div>
													<div id="ing_display_description">
														{this.langID ? (
															homeData.ingredients[0].desc.id
														) : (
															homeData.ingredients[0].desc.en
														)}
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="bg">
										<div id="ing_bg">
											{homeData.ingredients.map((node, id) => {
												return <img key={id} src={node.image} alt="herbamojo" />;
											})}
										</div>
									</div>
								</section>
								<section id="shop">
									<div className="wrapper">
										<h1>{this.langID ? transData.shop.title.id : transData.shop.title.id}</h1>
										<div className="content">
											{homeData.onlineshop.length > 0 && (
												<div>
													<h2>
														{this.langID ? (
															transData.shop.online.id
														) : (
															transData.shop.online.id
														)}
													</h2>
													<div
														id="onlineshop"
														className={`shopSlider ${homeData.onlineshop.length === 1
															? ' oneslide'
															: ''} ${homeData.onlineshop.length === 2
															? ' twoslide'
															: ''}`}
													>
														{homeData.onlineshop.length > 1 ? (
															<div
																className="arrow"
																onClick={() => {
																	if (this.onlineslider)
																		this.onlineslider.slickPrev();
																}}
															>
																<Arrow />
																<ArrowSmaller classProps="mobile" />
															</div>
														) : (
															<div className="arrow">
																<Arrow />
																<ArrowSmaller classProps="mobile" />
															</div>
														)}

														{homeData.onlineshop.length > 1 ? (
															<Slider
																{...sliderSettings}
																ref={(d) => (this.onlineslider = d)}
																className="wrapper"
															>
																{homeData.onlineshop.map((node, id) => {
																	return (
																		<div className="shop" key={id}>
																			{node.link ? (
																				<a
																					className="svg"
																					target="_blank"
																					rel="noopener noreferrer"
																					href={node.link}
																				>
																					<img
																						src={node.image}
																						alt="herbamojo"
																					/>
																				</a>
																			) : (
																				<div>
																					<img
																						src={node.image}
																						alt="herbamojo"
																					/>
																				</div>
																			)}
																		</div>
																	);
																})}
															</Slider>
														) : (
															<div className="wrapper">
																{homeData.onlineshop.map((node, id) => {
																	return (
																		<div className="shop" key={id}>
																			{node.link ? (
																				<a
																					className="svg"
																					target="_blank"
																					rel="noopener noreferrer"
																					href={node.link}
																				>
																					<img
																						src={node.image}
																						alt="herbamojo"
																					/>
																				</a>
																			) : (
																				<div>
																					<img
																						src={node.image}
																						alt="herbamojo"
																					/>
																				</div>
																			)}
																		</div>
																	);
																})};
															</div>
														)}
														{homeData.onlineshop.length > 1 ? (
															<div
																className="arrow"
																onClick={() => {
																	if (this.onlineslider)
																		this.onlineslider.slickNext();
																}}
															>
																<Arrow />
																<ArrowSmaller classProps="mobile" />
															</div>
														) : (
															<div className="arrow">
																<Arrow />
																<ArrowSmaller classProps="mobile" />
															</div>
														)}
													</div>
												</div>
											)}
											{homeData.offlineshop.length > 0 && (
												<div>
													<h2>
														{this.langID ? (
															transData.shop.offline.id
														) : (
															transData.shop.offline.id
														)}
													</h2>
													<div
														id="offlineshop"
														className={`shopSlider ${homeData.offlineshop.length === 1
															? ' oneslide'
															: ''} ${homeData.offlineshop.length === 2
															? ' twoslide'
															: ''}`}
													>
														{homeData.offlineshop.length > 1 ? (
															<div
																className="arrow"
																onClick={() => {
																	if (this.offlineslider)
																		this.offlineslider.slickPrev();
																}}
															>
																<Arrow />
																<ArrowSmaller classProps="mobile" />
															</div>
														) : (
															<div className="arrow">
																<Arrow />
																<ArrowSmaller classProps="mobile" />
															</div>
														)}

														{homeData.offlineshop.length > 1 ? (
															<Slider
																{...sliderSettings}
																ref={(c) => (this.offlineslider = c)}
																className="wrapper"
															>
																{homeData.offlineshop.map((node, id) => {
																	return (
																		<div className="shop" key={id}>
																			{node.link ? (
																				<a
																					className="svg"
																					target="_blank"
																					rel="noopener noreferrer"
																					href={node.link}
																				>
																					<img
																						src={node.image}
																						alt="herbamojo"
																					/>
																				</a>
																			) : (
																				<div>
																					<img
																						src={node.image}
																						alt="herbamojo"
																					/>
																				</div>
																			)}
																		</div>
																	);
																})}
															</Slider>
														) : (
															<div className="wrapper">
																{homeData.offlineshop.map((node, id) => {
																	return (
																		<div className="shop" key={id}>
																			{node.link ? (
																				<a
																					className="svg"
																					target="_blank"
																					rel="noopener noreferrer"
																					href={node.link}
																				>
																					<img
																						src={node.image}
																						alt="herbamojo"
																					/>
																				</a>
																			) : (
																				<div>
																					<img
																						src={node.image}
																						alt="herbamojo"
																					/>
																				</div>
																			)}
																		</div>
																	);
																})}
															</div>
														)}
														{homeData.offlineshop.length > 1 ? (
															<div
																className="arrow"
																onClick={() => {
																	if (this.offlineslider)
																		this.offlineslider.slickNext();
																}}
															>
																<Arrow />
																<ArrowSmaller classProps="mobile" />
															</div>
														) : (
															<div className="arrow">
																<Arrow />
																<ArrowSmaller classProps="mobile" />
															</div>
														)}
													</div>
												</div>
											)}
										</div>
									</div>
								</section>
								{!data.general.frontmatter.journaldisable && (
									<section id="journal">
										<div className="wrapper">
										<h1>{this.langID ? transData.journal.title.id : transData.journal.title.id}</h1>
										</div>
									</section>
								)}
							</div>
							<Footer />
						</Layout>
					);
				}}
			/>
		);
	}
}

const indexQuery = graphql`
	query {
		general: markdownRemark(frontmatter: { issetting: { eq: true }, contenttype: { eq: "general_setting" } }) {
			frontmatter {
				web_name
				journaldisable
				footer {
					email
					ig_link
					wa_no
				}
			}
		}
		home: markdownRemark(frontmatter: { issetting: { eq: true }, contenttype: { eq: "home_setting" } }) {
			frontmatter {
				title
				home {
					background
					backgroundmobile
				}
				about {
					background
					desc {
						en
						id
					}
				}
				ingredients {
					image
					title {
						en
						id
					}
					desc {
						en
						id
					}
				}
				onlineshop {
					image
					link
				}
				offlineshop {
					image
					link
				}
				translations {
					home {
						title {
							en
							id
						}
						kys {
							en {
								know
								your
								strength
							}
							id {
								know
								your
								strength
							}
						}
						getyours {
							en
							id
						}
						shopfloat {
							en
							id
						}
					}
					about {
						title {
							en
							id
						}
						cert {
							natural {
								en
								id
							}
							bpom {
								en
								id
							}
							halal {
								en
								id
							}
							quality {
								en
								id
							}
							expert {
								en
								id
							}
							quadra {
								en
								id
							}
						}
					}
					benefits {
						title {
							en
							id
						}
						stamina {
							en {
								line1
								line2
							}
							id {
								line1
								line2
							}
						}
						increases {
							en {
								line1
								line2
							}
							id {
								line1
								line2
							}
						}
						immune {
							en {
								line1
								line2
							}
							id {
								line1
								line2
							}
						}
						enhance {
							en {
								line1
								line2
							}
							id {
								line1
								line2
							}
						}
					}
					ingredients {
						title {
							en
							id
						}
					}
					shop {
						title {
							en
							id
						}
						online {
							en
							id
						}
						offline {
							en
							id
						}
					}
					journal {
						title {
							en
							id
						}
						viewall {
							en
							id
						}
					}
				}
			}
		}
	}
`;
