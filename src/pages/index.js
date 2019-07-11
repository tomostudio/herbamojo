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

// SLICK
import Slider from 'react-slick';

//JS SVG
import InstagramSVG from 'svg/instagram.js';
import EmailSVG from 'svg/email.js';
import WhatsappSVG from 'svg/whatsapp.js';
import { Arrow } from 'svg/symbols.js';

import FirstBG from 'images/static/herbamojo-bg2.jpg';
import SecondBG from 'images/static/herbamojo-bg1.jpg';
import BottleImg from 'images/static/herbamojo_productshot.png';

//SVG CERT
import CertBPOM from 'images/symbols/bpom.svg';
import CertNatural from 'images/symbols/natural.svg';
import CertQuality from 'images/symbols/quality.svg';
import CertResearch from 'images/symbols/research.svg';
import CertQuadra from 'images/symbols/Quadra.svg';
import CertHalal from 'images/symbols/halal.svg';

//SVG BENEFITS
import BenefitStamina from 'images/symbols/stamina.svg';
import BenefitEnergy from 'images/symbols/energy.svg';
import BenefitImmune from 'images/symbols/immune.svg';
import BenefitExercise from 'images/symbols/exercise.svg';

//INGREDIENTS IMAGES
import IngCabe from 'images/static/ingredients/cabe.png';
import IngGinseng from 'images/static/ingredients/ginseng.png';
import IngJahe from 'images/static/ingredients/jahe_merah.png';
import IngMaca from 'images/static/ingredients/maca.png';
import IngPasakBumi from 'images/static/ingredients/pasak_bumi.png';
import IngPurwaceng from 'images/static/ingredients/purwaceng.png';
import IngTribulus from 'images/static/ingredients/tribulus.png';

export default class Home extends React.Component {
	IndexLoader = new LoaderClass({
		parent: '.home.english',
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

			ScrollSnap.kill();

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
			this.scrollax.ing_bg = new Scrollax({ target: '#ing_bg', scroll_movement: 0.25 });

			//INGREDIENTS SET
			this.ingredientToggle(document.querySelector('#ing_sel > *:nth-child(1)'));
		}
	});
	inview = {
		footer: null,
		home: null,
		bottlesection: null
	};
	scrollax = {
		one: null,
		two: null,
		ing_bg: null
	};
	scrollsnap = null;
	componentDidMount() {
		if (typeof document !== `undefined`) {
			document.body.classList.remove('loaded');
		}
		this.IndexLoader.mountload();
	}
	componentWillUnmount() {
		if (this.inview.home) this.inview.home.kill();
		if (this.inview.footer) this.inview.footer.kill();
		if (this.inview.bottlesection) this.inview.bottlesection.kill();
		if (this.scrollax.one) this.scrollax.one.kill();
		if (this.scrollax.two) this.scrollax.two.kill();
		if (this.scrollax.ing_bg) this.scrollax.ing_bg.kill();
		if (this.scrollsnap) this.scrollsnap.kill();
	}
	gotoShop() {
		ScrollSnap.snap.to(4);
	}
	ingredientChanging = false;
	ingredientChangeTimeout = null;
	ingredientClick(e) {
		this.ingredientToggle(e.currentTarget);
	}
	ingredientToggle(target) {
		if (target != null) {
			const delay = 500;
			let child = target;
			let index = 1;
			while ((child = child.previousSibling) != null) index++;
			let change = {
				number: index,
				desc: target.dataset.desc
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

			target.classList.add('active');

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
					breakpoint: 750,
					settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
					}
				}
			],
			beforeChange: (current, next) => {
        console.log('changing',current, next);
			}
		};
		return (
			<Layout titleText="Home" mainClass="home english">
				<div className="overlay_wrapper">
					<div className="overlay">
						<div className="wrapper">
							<div>
								<Link className="disable" to="/">
									EN
								</Link>
								<Link to="/id">ID</Link>
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
								<div className="content half">
									<div className="logo">
										<img src={HerbamojoLogo} alt="herbamojo" />
									</div>
									<div className="description">
										HERBAMOJO is a high quality herbal formula to support male stamina.HERBAMOJO
										contains 7 key herbal ingredients that works optimally to help improve energy,
										immunity and performance.
									</div>
									<div className="certification">
										<div>
											<img src={CertNatural} alt="herbamojo" />
											<span>100% Natural</span>
										</div>

										<div>
											<img src={CertBPOM} alt="herbamojo" />
											<span>BPOM Approved</span>
										</div>

										<div>
											<img src={CertHalal} alt="herbamojo" />
											<span>Halal</span>
										</div>

										<div>
											<img src={CertQuality} alt="herbamojo" />
											<span>High Quality Extracts </span>
										</div>
										<div>
											<img src={CertResearch} alt="herbamojo" />
											<span>Expertly Researched</span>
										</div>

										<div>
											<img src={CertQuadra} alt="herbamojo" />
											<span>Quadra Extraction System</span>
										</div>
									</div>
								</div>
							</div>
							<div className="bg">
								<img className="paralax2" src={SecondBG} alt="herbamojo" />
							</div>
						</section>
						<section id="benefits">
							<div className="wrapper">
								<h1>BENEFITS</h1>
								<div className="content half">
									<div>
										<div>
											<img src={BenefitStamina} alt="herbamojo" />
											<div>
												<span>Supports</span>
												<span>Male Stamina</span>
											</div>
										</div>
										<div>
											<img src={BenefitEnergy} alt="herbamojo" />
											<div>
												<span>Increases</span>
												<span>Energy</span>
											</div>
										</div>
										<div>
											<img src={BenefitImmune} alt="herbamojo" />
											<div>
												<span>Supports</span>
												<span>Immune Function</span>
											</div>
										</div>
										<div>
											<img src={BenefitExercise} alt="herbamojo" />
											<div>
												<span>Enhances</span>
												<span>Exercise Performance</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</section>
					</div>
					<section id="ingredients">
						<div className="wrapper">
							<h1>Ingredients</h1>
							<div className="content">
								<div id="ing_sel">
									<span
										className="active"
										onClick={(e) => this.ingredientClick(e)}
										data-desc="Maca works to increase energy and stamina. Also works as an aphrodisiac"
									>
										<span>MACA</span>
										<span>MACA</span>
									</span>
									<span
										onClick={(e) => this.ingredientClick(e)}
										data-desc="
										Ginseng works to increase energy and stamina and support immune function. Also works as an aphrodisiac."
									>
										<span>GINSENG</span>
										<span>GINSENG</span>
									</span>
									<span
										onClick={(e) => this.ingredientClick(e)}
										data-desc="Red Ginger works to improve blood circulation and increase energy."
									>
										<span>RED GINGER</span>
										<span>RED GINGER</span>
									</span>
									<span
										onClick={(e) => this.ingredientClick(e)}
										data-desc="Tribulus works to increase male stamina."
									>
										<span>TRIBULUS</span>
										<span>TRIBULUS</span>
									</span>
									<span
										onClick={(e) => this.ingredientClick(e)}
										data-desc="Long Jack works to increase stamina and as an aphrodisiac."
									>
										<span>LONG JACK</span>
										<span>LONG JACK</span>
									</span>
									<span
										onClick={(e) => this.ingredientClick(e)}
										data-desc="Purwoceng works to increase stamina and as an aphrodisiac."
									>
										<span>PURWOCENG</span>
										<span>PURWOCENG</span>
									</span>
									<span
										onClick={(e) => this.ingredientClick(e)}
										data-desc="Javanese Long Pepper works to improve blood circulation."
									>
										<span>JAVANESE LONG PEPPER</span>
										<span>JAVANESE LONG PEPPER</span>
									</span>
								</div>
								<div id="ing_display">
									<div id="ing_display_number">1</div>
									<div id="ing_display_description">
										Maca works to increase energy and stamina. Also works as an aphrodisiac
									</div>
								</div>
							</div>
						</div>
						<div className="bg">
							<div id="ing_bg">
								<img src={IngMaca} alt="herbamojo" />
								<img src={IngGinseng} alt="herbamojo" />
								<img src={IngJahe} alt="herbamojo" />
								<img src={IngTribulus} alt="herbamojo" />
								<img src={IngPasakBumi} alt="herbamojo" />
								<img src={IngPurwaceng} alt="herbamojo" />
								<img src={IngCabe} alt="herbamojo" />
							</div>
						</div>
					</section>
					<section id="shop">
						<div className="wrapper">
							<h1>SHOP</h1>
							<div className="content">
								<div>
									<h2>ONLINE</h2>
									<div id="onlineshop" className="shopSlider noslider">
										<div className="arrow">
											<Arrow/>
										</div>
										<div className="wrapper">
                        <div className="shop">
                        <div>1</div>
                        </div>
										</div>
										<div className="arrow">
											<Arrow/>
										</div>
									</div>
								</div>
								<div>
									<h2>OFFLINE</h2>
									<div id="offlineshop" className="shopSlider">
										<div className="arrow" 
												onClick={() => {
													this.slider.slickPrev();
												}}>
											<Arrow/>
										</div>

                    <Slider {...sliderSettings} ref={(c) => (this.slider = c)} className="wrapper">
                        
                    <div className="shop">
                        <div>1</div>
                        </div>
                        <div className="shop">
                        <div>2</div>
                        </div>
                        <div className="shop">
                        <div>3</div>
                        </div>
                    </Slider>
										<div className="arrow" 
												onClick={() => {
													this.slider.slickNext();
												}}>
											<Arrow/>
										</div>
									</div>
								</div>
							</div>
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
