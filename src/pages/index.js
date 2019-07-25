import React from 'react';
import { StaticQuery, Link, graphql } from 'gatsby';
import lottie from 'lottie-web';
import { Helmet } from 'react-helmet';
import Glide from '@glidejs/glide';

//UTILS
import { ScrollSnapClass } from 'utils/scrollsnap';
import { Scrollax } from 'utils/scrollax';
import { ScrollIt } from 'utils/scrollit';
import { LoaderClass } from 'utils/loader';
import { InViewportClass, ScrollPassClass } from 'utils/inviewport';
import { MediaCheck } from 'utils/mediacheck';
import { ResponsiveVH } from 'utils/responsive-vh';
import { DisableScroll } from 'utils/disablescroll';

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
import BottleImgWebP from 'images/static/herbamojo_productshot.webp';

//SVG CERT
import CertBPOM from 'images/symbols/bpom.svg';
import CertNatural from 'images/symbols/natural.svg';
import CertQuality from 'images/symbols/quality.svg';
import CertResearch from 'images/symbols/research.svg';
import CertQuadra from 'images/symbols/quadra.svg';
import CertHalal from 'images/symbols/halal.svg';

//ANIMATION DATA FOR BENEFIT
import AnimDataEnergy from 'animationdata/energy.json';
import AnimDataImmune from 'animationdata/immune.json';
import AnimDataStamina from 'animationdata/stamina.json';
import AnimDataExercise from 'animationdata/exercise.json';

export default class Home extends React.Component {
	//TOGGLE LANGUAGE
	// --------------
	langID = this.props.langID || false;
	MainID = this.langID ? 'homeID' : 'homeEN';
	LoadAnimationDelay = 2000;
	LoadAnimationTimeout = null;
	// --------------
	IndexLoader = new LoaderClass({
		parent: `#${this.MainID}`,
		default_delay: 500,
		postload: () => {
			if (typeof window !== undefined) {
				window.scroll(0, 0);

				this.HomeScrollSnap = new ScrollSnapClass({
					sections_identifier: `main.home#${this.MainID} section`,
					snap_identifier: '',
					speed: 500,
					maxduration: 1000,
					responsive_width: 800,
					responsive_height: 500,
					hasfooter: false
				});
			}
			this.SnapNav = document.querySelectorAll(`main#${this.MainID} div.overlay .right_nav .snap_nav > *`);
			const setNav = (i) => {
				this.SnapNav.forEach((nav) => {
					nav.classList.remove('active');
				});
				if (i >= 0) {
					this.SnapNav[i].classList.add('active');
				}
			};
			setNav(0);

			//SETUP BUTTON
			this.SnapNav.forEach((nav, index) => {
				nav.onclick = () => {
					this.HomeScrollSnap.snap.to(index);
				};
			});

			// SCROLL PASS FOR BOTTLE FLOAT
			this.scrollpass.bottlesection = new ScrollPassClass({
				target: '.bottlesection_wrapper',
				detectbottom: true,
				passed: () => {
					document.querySelector('div.bottlewrapper').classList.add('stuck');
				},
				notpassed: () => {
					document.querySelector('div.bottlewrapper').classList.remove('stuck');
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
					// document.querySelector('section#home').classList.remove('inview');
					document.querySelector('#ShopButton').classList.remove('hide');
				}
			});
			this.inview.about = new InViewportClass({
				target: 'section#about',
				visibility: 0.55,
				enter: () => {
					setNav(1);
					document.querySelector('section#about').classList.add('inview');
				}
			});
			this.inview.aboutm = new InViewportClass({
				target: 'section#about',
				visibility: 0.25,
				enter: () => {
					if (MediaCheck.width.mtablet()) {
						document.querySelector('section#about').classList.add('inview');
					}
				}
			});

			let BenefitAnimTimeout1 = null,
				BenefitAnimTimeout2 = null;
			this.inview.benefits = new InViewportClass({
				target: 'section#benefits',
				visibility: 0.55,
				enter: () => {
					setNav(2);
					if (BenefitAnimTimeout1 !== null) clearTimeout(BenefitAnimTimeout1);
					if (BenefitAnimTimeout2 !== null) clearTimeout(BenefitAnimTimeout2);
					if (!MediaCheck.width.mtablet()) {
						this.AnimObject.forEach((obj, index) => {
							if (this.AnimObject[index].anim) this.AnimObject[index].anim.goToAndStop(0);
						});
						document.querySelector('section#benefits').classList.add('inview');
						BenefitAnimTimeout1 = setTimeout(() => {
							if (this.AnimObject[0].anim) this.AnimObject[0].anim.goToAndPlay(0);
							if (this.AnimObject[1].anim) this.AnimObject[1].anim.goToAndPlay(0);
						}, 250);
						BenefitAnimTimeout2 = setTimeout(() => {
							if (this.AnimObject[2].anim) this.AnimObject[2].anim.goToAndPlay(0);
							if (this.AnimObject[3].anim) this.AnimObject[3].anim.goToAndPlay(0);
						}, 750);
					}
				},
				exit: () => {
					document.querySelector('section#benefits').classList.remove('inview');
					if (BenefitAnimTimeout1 !== null) clearTimeout(BenefitAnimTimeout1);
					if (BenefitAnimTimeout2 !== null) clearTimeout(BenefitAnimTimeout2);
				}
			});
			const AllBenefits = document.querySelectorAll('section#benefits .content.half>div>div');
			AllBenefits.forEach((benefit, index) => {
				this.inview.benefitsm[index] = new InViewportClass({
					target: `section#benefits .content.half>div>div:nth-child(${index + 1})`,
					visibility: 0.75,
					enter: () => {
						if (MediaCheck.width.mtablet()) {
							if (!benefit.classList.contains('inview')) {
								benefit.classList.add('inview');
								if (this.AnimObject[index].anim) this.AnimObject[index].anim.goToAndPlay(0);
							}
						}
					},
					exit: () => {
						if (MediaCheck.width.mtablet()) benefit.classList.remove('inview');
					}
				});
			});

			this.inview.ingredients = new InViewportClass({
				target: 'section#ingredients',
				visibility: 0.55,
				enter: () => {
					setNav(3);
					if (!MediaCheck.width.mtablet()) {
						document.querySelector('section#ingredients').classList.add('inview');
					}
				},
				exit: () => {
					if (!MediaCheck.width.mtablet()) {
						document.querySelector('section#ingredients').classList.remove('inview');
					}
				}
			});
			this.inview.ingredientsm = new InViewportClass({
				target: 'section#ingredients',
				visibility: 0.25,
				enter: () => {
					if (MediaCheck.width.mtablet()) {
						document.querySelector('section#ingredients').classList.add('inview');
					}
				},
				exit: () => {
					if (MediaCheck.width.mtablet()) {
						document.querySelector('section#ingredients').classList.remove('inview');
					}
				}
			});
			this.inview.shop = new InViewportClass({
				target: 'section#shop',
				visibility: 0.55,
				enter: () => {
					setNav(4);
					if (!MediaCheck.width.mtablet()) document.querySelector('section#shop').classList.add('inview');
				},
				exit: () => {
					if (!MediaCheck.width.mtablet()) document.querySelector('section#shop').classList.remove('inview');
				}
			});
			this.inview.shopm = new InViewportClass({
				target: 'section#shop',
				visibility: 0.25,
				enter: () => {
					if (MediaCheck.width.mtablet()) document.querySelector('section#shop').classList.add('inview');
				},
				exit: () => {
					if (MediaCheck.width.mtablet()) document.querySelector('section#shop').classList.remove('inview');
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

			// SCROLLAX
			this.scrollax.one = new Scrollax({ target: 'img.paralax1', move_right: 0.25 });
			this.scrollax.two = new Scrollax({ target: 'img.paralax2', move_left: 0.25 });
			this.scrollax.ing_bg = new Scrollax({ target: '#ing_bg', move_top: 0.35 });
			this.scrollax.home_mobile = new Scrollax({ target: 'img.mobile.prlx', move_bottom: 0.3 });
			this.scrollax.about_mobile = new Scrollax({ target: '#about .content .bottle > img', move_bottom: 0.3 });

			//INGREDIENTS SET
			this.ingredientToggle(document.querySelector('#ing_sel > *:nth-child(1) > div:first-child'));

			//GLIDE SETUP
			const glidesetting = {
				type: 'carousel',
				startAt: 0,
				perView: 2,
				breakpoints: {
					800: {
						perView: 1
					}
				}
			};

			if (typeof document !== `undefined`) {
				if (document.querySelector('#onlineslider'))
					this.slider.online = new Glide('#onlineslider', glidesetting).mount();
				if (document.querySelector('#offlineslider'))
					this.slider.offline = new Glide('#offlineslider', glidesetting).mount();
			}
			// TRIGGER SCROLL SNAP INIT AND PAUSE
			if (typeof document !== `undefined`) {
				document.body.classList.add('loaded');
				this.HomeScrollSnap.init();
				this.HomeScrollSnap.pause();
			}

			// INIT RESIZE
			this.resize();

			this.ForceVH = new ResponsiveVH({ target: '.fitheight' });
			this.scrollpass.bottlesection.trigger();

			// SET ANIMATION DELAY
			if (this.LoadAnimationTimeout !== null) clearTimeout(this.LoadAnimationTimeout);
			this.LoadAnimationTimeout = setTimeout(() => {
				//ENABLE SCROLL
				if (this.disableScrollBody !== null) this.disableScrollBody.enable();
				this.HomeScrollSnap.play();
				if (this.LoadAnimationTimeout !== null) clearTimeout(this.LoadAnimationTimeout);
			}, this.LoadAnimationDelay);
		}
	});
	slider = {
		online: null,
		offline: null
	};
	inview = {
		footer: null,
		home: null,
		about: null,
		aboutm: null,
		benefits: null,
		benefitsm: [ null, null, null, null ],
		ingredients: null,
		ingredientsm: null,
		shop: null,
		shopm: null
	};
	scrollpass = {
		bottlesection: null
	};
	scrollax = {
		one: null,
		home_mobile: null,
		two: null,
		ing_bg: null
	};
	AnimObject = [
		{
			id_name: 'benefitstamina',
			anim: null,
			animeData: AnimDataStamina
		},
		{
			id_name: 'benefit_energy',
			anim: null,
			animeData: AnimDataEnergy
		},
		{
			id_name: 'BenefitImmune',
			anim: null,
			animeData: AnimDataImmune
		},
		{
			id_name: 'BenefitExercise',
			anim: null,
			animeData: AnimDataExercise
		}
	];
	disableScrollBody = null;
	HomeScrollSnap = null;
	SnapNav = null;
	ForceVH = null;
	componentDidMount() {
		if (typeof document !== `undefined`) {
			document.body.classList.remove('loaded');
			if (this.langID) {
				document.querySelector('html').setAttribute('lang', 'id');
			} else {
				document.querySelector('html').setAttribute('lang', 'en');
			}
		}
		this.IndexLoader.mountload();
		if (!document.body.classList.contains('loaded')) {
			//DISABLE SCROLL ON MAIN WINDOW
			this.disableScrollBody = new DisableScroll();
		}

		// SETUP LOTTIE
		const _ap = false;
		this.AnimObject.forEach((obj, index) => {
			this.AnimObject[index].anim = lottie.loadAnimation({
				container: document.querySelector(`#${this.AnimObject[index].id_name}`),
				name: this.AnimObject[index].id_name,
				renderer: 'svg',
				loop: false,
				autoplay: _ap,
				animationData: this.AnimObject[index].animeData
			});
			this.AnimObject[index].anim.goToAndStop(0);
		});
	}
	componentWillUnmount() {
		if (this.inview.home) this.inview.home.kill();
		if (this.inview.about) this.inview.about.kill();
		if (this.inview.aboutm) this.inview.aboutm.kill();
		if (this.inview.benefits) this.inview.benefits.kill();
		this.inview.benefitsm.forEach((benefit, index) => {
			if (this.inview.benefitsm[index]) this.inview.benefitsm[index].kill();
		});
		if (this.inview.ingredients) this.inview.ingredients.kill();
		if (this.inview.ingredientsm) this.inview.ingredientsm.kill();
		if (this.inview.shop) this.inview.shop.kill();
		if (this.inview.shopm) this.inview.shopm.kill();
		if (this.inview.footer) this.inview.footer.kill();
		if (this.scrollpass.bottlesection) this.scrollpass.bottlesection.kill();
		if (this.scrollax.one) this.scrollax.one.kill();
		if (this.scrollax.two) this.scrollax.two.kill();
		if (this.scrollax.ing_bg) this.scrollax.ing_bg.kill();
		if (this.scrollax.home_mobile) this.scrollax.home_mobile.kill();
		if (typeof document !== `undefined`) if (this.HomeScrollSnap) this.HomeScrollSnap.kill();
		if (this.disableScrollBody !== null) this.disableScrollBody.enable();

		if (this.slider.online !== null) this.slider.online.destroy();
		if (this.slider.offline !== null) this.slider.offline.destroy();

		if (this.ForceVH) this.ForceVH.kill();
		if (this.LoadAnimationTimeout !== null) clearTimeout(this.LoadAnimationTimeout);

		this.AnimObject.forEach((obj, index) => {
			if (this.AnimObject[index].anim !== null) {
				this.AnimObject[index].anim.stop();
				this.AnimObject[index].anim = null;
			}
		});

		this.SnapNav.forEach((nav, index) => {
			nav.onClick = null;
		});

		if (typeof document !== `undefined`) {
			//RESET MOBILE MENU OPEN
			document.body.classList.remove('menu_open');
			window.removeEventListener('resize', this.resize, false);
		}
	}
	inviewRetrigger() {
		if (this.inview.home) this.inview.home.trigger();
		if (this.inview.about) this.inview.about.trigger();
		if (this.inview.aboutm) this.inview.aboutm.trigger();
		if (this.inview.benefits) this.inview.benefits.trigger();
		this.inview.benefitsm.forEach((benefit, index) => {
			if (this.inview.benefitsm[index]) this.inview.benefitsm[index].trigger();
		});
		if (this.inview.ingredients) this.inview.ingredients.trigger();
		if (this.inview.ingredientsm) this.inview.ingredientsm.trigger();
		if (this.inview.shop) this.inview.shop.trigger();
		if (this.inview.shopm) this.inview.shopm.trigger();
		if (this.inview.footer) this.inview.footer.trigger();
	}
	scrollaxCallibrate() {
		if (this.scrollax.one) this.scrollax.one.trigger();
		if (this.scrollax.two) this.scrollax.two.trigger();
		if (this.scrollax.ing_bg) this.scrollax.ing_bg.trigger();
		if (this.scrollax.home_mobile) this.scrollax.home_mobile.trigger();
	}
	resize = () => {
		//ADJUST INGREDIENTS DESCRIPTION MOBILE HEIGHT
		const ingDescMobile = document.querySelectorAll('#ing_sel > span > div:last-child > div');
		let height = [];
		ingDescMobile.forEach((desc) => {
			height.push(desc.clientHeight);
			desc.parentNode.style.height = desc.clientHeight.toString() + 'px';
		});
		if (!MediaCheck.width.mtablet) {
			// REMOVE MENU OPEN WHEN IT IS NOT MOBILE
			document.body.classList.remove('menu_open');
		}
		this.inviewRetrigger();

		if (this.slider.online !== null) {
			const _so = document.querySelector('#onlineshop');
			if (!MediaCheck.width.mtablet()) {
				if (_so.classList.contains('twoslide')) {
					this.slider.online.disable();
				}
			} else {
				this.slider.online.enable();
			}
		}
		if (this.slider.offline !== null) {
			const _so = document.querySelector('#offlineshop');
			if (!MediaCheck.width.mtablet()) {
				if (_so.classList.contains('twoslide')) {
					this.slider.offline.disable();
				}
			} else {
				this.slider.offline.enable();
			}
		}
	};
	gotoShop = () => {
		if (MediaCheck.width.mtablet()) {
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
			this.HomeScrollSnap.snap.to(4);
		}
	};
	ingredientChanging = false;
	ingredientChangeTimeout = null;
	ingredientClick(e) {
		this.ingredientToggle(e.currentTarget);
	}
	ingredientToggle(target) {
		if (target != null) {
			const delay = MediaCheck.width.mtablet ? 500 : 500;
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

			// ADD BACKGROUND TRANSITION;
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
				setTimeout(() => {
					this.scrollaxCallibrate();
				}, 10);
				this.menuToggle();
			}
		}
	}
	render() {
		this.IndexLoader.renderload();

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
					const id_seodesc = generalData.seo.seo_shortdesc_id;
					return (
						<Layout mainClass="home" indo={this.langID} mainID={this.MainID}>
							{this.langID && (
								<Helmet>
									{id_seodesc && <meta name="description" content={id_seodesc} />}
									{id_seodesc && <meta property="og:description" content={id_seodesc} />}
									{id_seodesc && <meta name="twitter:description" content={id_seodesc} />}
								</Helmet>
							)}
							<MobileHeader indonesia={this.langID} />
							<div id="MobileNavigation">
								<div>
									<div className="menubutton" onClick={(e) => this.menuToggle(e)}>
										<span />
										<span />
										<span />
									</div>
								</div>
								<div className="">
									<div>
										<div className="closebutton" onClick={(e) => this.menuToggle(e)}>
											<span />
											<span />
										</div>
									</div>
									<div className="fitheight">
										<div>
											<span onClick={(e) => this.mobileScroll(e)}>
												{this.langID ? transData.home.title.id : transData.home.title.en}
											</span>
											<span onClick={(e) => this.mobileScroll(e)}>
												{this.langID ? transData.about.title.id : transData.about.title.en}
											</span>
											<span onClick={(e) => this.mobileScroll(e)}>
												{this.langID ? (
													transData.benefits.title.id
												) : (
													transData.benefits.title.en
												)}
											</span>
											<span onClick={(e) => this.mobileScroll(e)}>
												{this.langID ? (
													transData.ingredients.title.id
												) : (
													transData.ingredients.title.en
												)}
											</span>
											<span onClick={(e) => this.mobileScroll(e)}>
												{this.langID ? transData.shop.title.id : transData.shop.title.en}
											</span>

											{!data.general.frontmatter.journaldisable && (
												<span onClick={(e) => this.mobileScroll(e)}>
													{this.langID ? (
														transData.journal.title.id
													) : (
														transData.journal.title.en
													)}
												</span>
											)}
											<div>
												<div>
													{footerData.ig_link !== '' && (
														<a
															className="svg"
															target="_blank"
															rel="noopener noreferrer"
															href={footerData.ig_link}
															aria-label="Instagram"
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
															aria-label="Whatsapp"
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
															aria-label="Email"
														>
															<EmailSVG />
														</a>
													)}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="overlay_wrapper">
								<div className="overlay">
									<div className="wrapper">
										<div>
											<Link
												aria-label="English"
												className={`${!this.props.langID && 'disable'}`}
												to="/"
											>
												EN
											</Link>
											<Link
												aria-label="Indonesia"
												className={`${this.props.langID && 'disable'}`}
												to="/id"
											>
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
															transData.home.title.en
														)}
													</span>
												</span>
												<span className="active">
													<span>
														{this.langID ? (
															transData.about.title.id
														) : (
															transData.about.title.en
														)}
													</span>
												</span>
												<span>
													<span>
														{this.langID ? (
															transData.benefits.title.id
														) : (
															transData.benefits.title.en
														)}
													</span>
												</span>
												<span>
													<span>
														{this.langID ? (
															transData.ingredients.title.id
														) : (
															transData.ingredients.title.en
														)}
													</span>
												</span>
												<span>
													<span>
														{this.langID ? (
															transData.shop.title.id
														) : (
															transData.shop.title.en
														)}
													</span>
												</span>
												{!data.general.frontmatter.journaldisable && (
													<span>
														<span>
															{this.langID ? (
																transData.journal.title.id
															) : (
																transData.journal.title.en
															)}
														</span>
													</span>
												)}
											</div>
											<div className="social_ctn">
												{footerData.ig_link !== '' && (
													<a
														className="svg"
														target="_blank"
														rel="noopener noreferrer"
														href={footerData.ig_link}
														aria-label="Instagram"
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
														aria-label="Whatsapp"
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
														aria-label="Email"
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
										<div>
											<picture>
												<source srcSet={BottleImgWebP} type="image/webp" />
												<source srcSet={BottleImg}  type="image/jpeg" />
												<img src={BottleImg}  alt="Herbamojo" />
											</picture>
											<span id="ShopButton" className="hide" onClick={this.gotoShop}>
												{this.langID ? (
													transData.home.shopfloat.id
												) : (
													transData.home.shopfloat.en
												)}
											</span>
										</div>
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
											<h1>{this.langID ? transData.about.title.id : transData.about.title.en}</h1>
											<div className="content half">
												<div className="logo">
													<img src={HerbamojoLogo} alt="herbamojo" />
												</div>
												<div className="bottle">
													<img src={BottleImg} alt="herbamojo" />
												</div>
												<div className="description">
													{this.langID ? homeData.about.desc.id : homeData.about.desc.en}
												</div>
												<div className="certification">
													<div>
														<img src={CertNatural} alt="herbamojo" />
														<span>
															{this.langID ? (
																transData.about.cert.natural.id
															) : (
																transData.about.cert.natural.en
															)}
														</span>
													</div>

													<div>
														<img src={CertBPOM} alt="herbamojo" />
														<span>
															{this.langID ? (
																transData.about.cert.bpom.id
															) : (
																transData.about.cert.bpom.en
															)}
														</span>
													</div>

													<div>
														<img src={CertHalal} alt="herbamojo" />
														<span>
															{this.langID ? (
																transData.about.cert.halal.id
															) : (
																transData.about.cert.halal.en
															)}
														</span>
													</div>

													<div>
														<img src={CertQuality} alt="herbamojo" />
														<span>
															{this.langID ? (
																transData.about.cert.quality.id
															) : (
																transData.about.cert.quality.en
															)}
														</span>
													</div>
													<div>
														<img src={CertResearch} alt="herbamojo" />
														<span>
															{this.langID ? (
																transData.about.cert.expert.id
															) : (
																transData.about.cert.expert.en
															)}
														</span>
													</div>

													<div>
														<img src={CertQuadra} alt="herbamojo" />
														<span>
															{this.langID ? (
																transData.about.cert.quadra.id
															) : (
																transData.about.cert.quadra.en
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
													transData.benefits.title.en
												)}
											</h1>
											<div className="content half">
												<div>
													<div>
														<div id={this.AnimObject[0].id_name}>
															{/* <img src={BenefitStamina} alt="herbamojo" /> */}
														</div>
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
														<div id={this.AnimObject[1].id_name}>
															{/* <img src={BenefitEnergy} alt="herbamojo" /> */}
														</div>
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
														<div id={this.AnimObject[2].id_name}>
															{/* <img src={BenefitImmune} alt="herbamojo" /> */}
														</div>
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
														<div id={this.AnimObject[3].id_name}>
															{/* <img src={BenefitExercise} alt="herbamojo" /> */}
														</div>
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
												transData.ingredients.title.en
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
										<h1>{this.langID ? transData.shop.title.id : transData.shop.title.en}</h1>
										<div className="content">
											{(homeData.onlineshop.length > 1 || (homeData.onlineshop.length === 1 && homeData.onlineshop[0].image !== '') ) && (
												<div>
													<h2>
														{this.langID ? (
															transData.shop.online.id
														) : (
															transData.shop.online.en
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
																	if (this.slider.online) this.slider.online.go('<');
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
															<div id="onlineslider" className="glide wrapper">
																<div data-glide-el="track" className="glide__track">
																	<div className="glide__slides ">
																		{homeData.onlineshop.map((node, id) => {
																			return (
																				<div
																					className="shop glide__slide"
																					key={id}
																					dataid={id}
																				>
																					{node.link ? (
																						<a
																							target="_blank"
																							rel="noopener noreferrer"
																							href={node.link}
																							style={{
																								background:
																									node.background !==
																									null
																										? node.background
																										: 'transparent'
																							}}
																							aria-label="Shop Slider"
																						>
																							<img
																								src={node.image}
																								alt="herbamojo"
																							/>
																						</a>
																					) : (
																						<div
																							style={{
																								background:
																									node.background !==
																									null
																										? node.background
																										: 'transparent'
																							}}
																						>
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
																</div>
															</div>
														) : (
															<div className="wrapper">
																{homeData.onlineshop.map((node, id) => {
																	return (
																		<div className="shop" key={id} dataid={id}>
																			{node.link ? (
																				<a
																					target="_blank"
																					rel="noopener noreferrer"
																					href={node.link}
																					style={{
																						background:
																							node.background !== null
																								? node.background
																								: 'transparent'
																					}}
																					aria-label="Shop Slider"
																				>
																					<img
																						src={node.image}
																						alt="herbamojo"
																					/>
																				</a>
																			) : (
																				<div
																					style={{
																						background:
																							node.background !== null
																								? node.background
																								: 'transparent'
																					}}
																				>
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
																	if (this.slider.online) this.slider.online.go('>');
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
											{(homeData.offlineshop.length > 1 || (homeData.offlineshop.length === 1 && homeData.offlineshop[0].image !== '') ) && (
												<div>
													<h2>
														{this.langID ? (
															transData.shop.offline.id
														) : (
															transData.shop.offline.en
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
																	if (this.slider.offline)
																		this.slider.offline.go('<');
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
															<div id="offlineslider" className="glide wrapper">
																<div data-glide-el="track" className="glide__track">
																	<div className="glide__slides ">
																		{homeData.offlineshop.map((node, id) => {
																			return (
																				<div
																					className="shop glide__slide"
																					key={id}
																					dataid={id}
																				>
																					{node.link ? (
																						<a
																							target="_blank"
																							rel="noopener noreferrer"
																							href={node.link}
																							style={{
																								background:
																									node.background !==
																									null
																										? node.background
																										: 'transparent'
																							}}
																							aria-label="Shop Slider"
																						>
																							<img
																								src={node.image}
																								alt="herbamojo"
																							/>
																						</a>
																					) : (
																						<div
																							style={{
																								background:
																									node.background !==
																									null
																										? node.background
																										: 'transparent'
																							}}
																						>
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
																</div>
															</div>
														) : (
															<div className="wrapper">
																{homeData.offlineshop.map((node, id) => {
																	return (
																		<div className="shop" key={id} dataid={id}>
																			{node.link ? (
																				<a
																					target="_blank"
																					rel="noopener noreferrer"
																					href={node.link}
																					style={{
																						background:
																							node.background !== null
																								? node.background
																								: 'transparent'
																					}}
																					aria-label="Shop Slider"
																				>
																					<img
																						src={node.image}
																						alt="herbamojo"
																					/>
																				</a>
																			) : (
																				<div
																					style={{
																						background:
																							node.background !== null
																								? node.background
																								: 'transparent'
																					}}
																				>
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
																	if (this.slider.offline)
																		this.slider.offline.go('>');
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
											<h1>
												{this.langID ? transData.journal.title.id : transData.journal.title.en}
											</h1>
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
				seo {
					seo_shortdesc_id
				}
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
					background
				}
				offlineshop {
					image
					link
					background
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
