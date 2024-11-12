import React from 'react';
import { StaticQuery, Link, graphql } from 'gatsby';
import lottie from 'lottie-web';
import { Helmet } from 'react-helmet';
import Glide from '@glidejs/glide';
import { GatsbyImage } from "gatsby-plugin-image";

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
import MobileHomeHeader from 'components/mobilehomeheader';

//JS SVG
import InstagramSVG from 'svg/instagram.js';
import EmailSVG from 'svg/email.js';
import WhatsappSVG from 'svg/whatsapp.js';
import { Arrow, ArrowSmaller } from 'svg/symbols.js';

//IMAGES
import HerbamojoLogo from 'images/symbols/herbamojologo.svg';
import BottleImg from 'images/static/herbamojo_productshot_2_112020.png';
import BottleImgWebP from 'images/static/herbamojo_productshot_2_112020.webp';

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

const ShopImages = ({ fluid }) => {
  return (
    <GatsbyImage
      image={fluid}
      imgStyle={{
        objectFit: 'contain',
        objectPosition: 'center',
        width: '100%',
        height: '100%',
      }}
      style={{
        width: '100%',
        height: '100%',
      }}
      loading={'eager'}
      durationFadeIn={10}
      fadeIn={false}
      backgroundColor='#000000'
      alt='herbamojo' />
  );
};

export default class Home extends React.Component {
  // --------------
  langID = this.props.langID || false;
  MainID = this.langID ? 'homeID' : 'homeEN';
  LoadAnimationDelay = 2000;
  LoadAnimationTimeout = null;
  // VARIABLES
  // --------------
  slider = {
    online: null,
    offline: null,
    stockist: null,
  };
  sliderStatus = {
    online: 'NOSLIDER',
    offline: 'NOSLIDER',
    stockist: 'NOSLIDER',
  };
  inviewArray = [];
  inviewArrayBenefits = [null, null, null, null];
  scrollpass = [];
  scrollaxArray = [];
  popupEnable = null;
  popupAlways = false;
  AnimObject = [
    {
      id_name: 'benefitstamina',
      anim: null,
      animeData: AnimDataStamina,
    },
    {
      id_name: 'benefit_energy',
      anim: null,
      animeData: AnimDataEnergy,
    },
    {
      id_name: 'BenefitImmune',
      anim: null,
      animeData: AnimDataImmune,
    },
    {
      id_name: 'BenefitExercise',
      anim: null,
      animeData: AnimDataExercise,
    },
  ];
  HomeScrollSnap = null;
  SnapNav = null;
  ForceVH = null;
  //SLIDER SETTING (GLIDE)
  glidesetting = {
    type: 'carousel',
    startAt: 0,
    perView: 1,
    gap: 0,
  };
  glidesetting2 = {
    type: 'carousel',
    startAt: 0,
    perView: 2,
    gap: 40,
    breakpoints: {
      900: {
        perView: 1,
      },
    },
  };
  constructor(props) {
    super(props);

    this.popUpRef = React.createRef();
    this.popUpRefContainer = React.createRef();
    this.state = { popupReveal: false };

    this.closePopUp = () => {
      if (
        this.popUpRef.current.classList.contains('popup') &&
        this.state.popupReveal
      ) {
        this.setState = { popupReveal: false };
        this.popUpRef.current.classList.remove('popup');
        this.HomeScrollSnap.play();
      }
    };
  }
  // --------------
  IndexLoader = new LoaderClass({
    parent: `#${this.MainID}`,
    default_delay: 500,
    postload: () => {
      if (typeof window !== undefined) {
        window.scrollTo(0, 0);
        this.HomeScrollSnap = new ScrollSnapClass({
          sections_identifier: `main.home#${this.MainID} section`,
          snap_identifier: '',
          speed: 500,
          maxduration: 1000,
          responsive_width: 800,
          responsive_height: 500,
          hasfooter: false,
        });
      }

      this.SnapNav = document.querySelectorAll(
        `main#${this.MainID} div.overlay .right_nav .snap_nav > *`
      );

      const setNav = (i) => {
        this.SnapNav.forEach((nav) => {
          nav.classList.remove('active');
        });
        if (i >= 0) {
          if (this.SnapNav[i]) this.SnapNav[i].classList.add('active');
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
      this.scrollpass[0] = new ScrollPassClass({
        target: '.bottlesection_wrapper',
        detectbottom: true,
        passed: () => {
          document.querySelector('div.bottlewrapper').classList.add('stuck');
        },
        notpassed: () => {
          document.querySelector('div.bottlewrapper').classList.remove('stuck');
        },
      });

      // INVIEW SETUP
      // HOME
      this.inviewArray[0] = new InViewportClass({
        target: 'section#home',
        visibility: 0.55,
        enter: () => {
          document.querySelector('#ShopButton').classList.add('hide');
          document.querySelector('section#home').classList.add('inview');
          setNav(0);
        },
        exit: () => {
          document.querySelector('#ShopButton').classList.remove('hide');
        },
      });
      //ABOUT
      this.inviewArray[1] = new InViewportClass({
        target: 'section#about',
        visibility: 0.55,
        enter: () => {
          setNav(1);
          document.querySelector('section#about').classList.add('inview');
        },
      });

      //ABOUT MOBILE
      this.inviewArray[2] = new InViewportClass({
        target: 'section#about',
        visibility: 0.25,
        enter: () => {
          if (MediaCheck.width.mtablet()) {
            document.querySelector('section#about').classList.add('inview');
          }
        },
        exit: () => {
          if (MediaCheck.width.mtablet()) {
            document.querySelector('section#about').classList.remove('inview');
          }
        },
      });

      //BENEFITS
      let BenefitAnimTimeout1 = null,
        BenefitAnimTimeout2 = null;
      this.inviewArray[3] = new InViewportClass({
        target: 'section#benefits',
        visibility: 0.55,
        enter: () => {
          setNav(2);
          if (BenefitAnimTimeout1 !== null) clearTimeout(BenefitAnimTimeout1);
          if (BenefitAnimTimeout2 !== null) clearTimeout(BenefitAnimTimeout2);
          if (!MediaCheck.width.mtablet()) {
            this.AnimObject.forEach((obj, index) => {
              if (this.AnimObject[index].anim)
                this.AnimObject[index].anim.goToAndStop(0);
            });
            document.querySelector('section#benefits').classList.add('inview');
            BenefitAnimTimeout1 = setTimeout(() => {
              if (this.AnimObject[0].anim)
                this.AnimObject[0].anim.goToAndPlay(0);
              if (this.AnimObject[1].anim)
                this.AnimObject[1].anim.goToAndPlay(0);
            }, 250);
            BenefitAnimTimeout2 = setTimeout(() => {
              if (this.AnimObject[2].anim)
                this.AnimObject[2].anim.goToAndPlay(0);
              if (this.AnimObject[3].anim)
                this.AnimObject[3].anim.goToAndPlay(0);
            }, 750);
          }
        },
        exit: () => {
          document.querySelector('section#benefits').classList.remove('inview');
          if (BenefitAnimTimeout1 !== null) clearTimeout(BenefitAnimTimeout1);
          if (BenefitAnimTimeout2 !== null) clearTimeout(BenefitAnimTimeout2);
        },
      });

      //BENEFITS MOBILE
      const AllBenefits = document.querySelectorAll(
        'section#benefits .content.half>div>div'
      );
      AllBenefits.forEach((benefit, index) => {
        this.inviewArrayBenefits[index] = new InViewportClass({
          target: `section#benefits .content.half>div>div:nth-child(${
            index + 1
          })`,
          visibility: 0.75,
          enter: () => {
            if (MediaCheck.width.mtablet()) {
              if (!benefit.classList.contains('inview')) {
                benefit.classList.add('inview');
                if (this.AnimObject[index].anim)
                  this.AnimObject[index].anim.goToAndPlay(0);
              }
            }
          },
          exit: () => {
            if (MediaCheck.width.mtablet()) benefit.classList.remove('inview');
          },
        });
      });
      //INGREDIENTS
      this.inviewArray[4] = new InViewportClass({
        target: 'section#ingredients',
        visibility: 0.55,
        enter: () => {
          setNav(3);
          if (!MediaCheck.width.mtablet()) {
            document
              .querySelector('section#ingredients')
              .classList.add('inview');
          }
        },
        exit: () => {
          if (!MediaCheck.width.mtablet()) {
            document
              .querySelector('section#ingredients')
              .classList.remove('inview');
          }
        },
      });
      //INGREDIENTS MOBILE
      this.inviewArray[5] = new InViewportClass({
        target: 'section#ingredients',
        visibility: 0.25,
        enter: () => {
          if (MediaCheck.width.mtablet()) {
            document
              .querySelector('section#ingredients')
              .classList.add('inview');
          }
        },
        exit: () => {
          if (MediaCheck.width.mtablet()) {
            document
              .querySelector('section#ingredients')
              .classList.remove('inview');
          }
        },
      });
      //SHOP
      this.inviewArray[6] = new InViewportClass({
        target: 'section#shop',
        visibility: 0.25,
        enter: () => {
          setNav(4);
          if (!MediaCheck.width.mtablet())
            document.querySelector('section#shop').classList.add('inview');
        },
        exit: () => {
          if (!MediaCheck.width.mtablet())
            document.querySelector('section#shop').classList.remove('inview');
        },
      });
      //SHOP MOBILE
      this.inviewArray[7] = new InViewportClass({
        target: 'section#shop',
        visibility: 0.1,
        enter: () => {
          if (MediaCheck.width.mtablet())
            document.querySelector('section#shop').classList.add('inview');
        },
        exit: () => {
          if (MediaCheck.width.mtablet())
            document.querySelector('section#shop').classList.remove('inview');
        },
      });

      this.inviewArray[8] = new InViewportClass({
        target: 'section#journal',
        visibility: 0.4,
        enter: () => {
          document.querySelector('section#journal').classList.add('inview');
          if (!MediaCheck.width.mtablet()) {
            setNav(5);
          }
        },
        exit: () => {
          document.querySelector('section#journal').classList.remove('inview');
        },
      });

      this.inviewArray[9] = new InViewportClass({
        target: 'section.footer',
        visibility: 0.05,
        enter: () => {
          document.querySelector('div.overlay').classList.add('stuck');
          setNav(-1);
        },
        exit: () => {
          document.querySelector('div.overlay').classList.remove('stuck');
          setNav(this.SnapNav.length - 1);
        },
      });

      // SCROLLAX
      this.scrollaxArray[0] = new Scrollax({
        target: '.paralax1',
        // move_right: 0.25,
        transform_x: -0.25,
      });
      this.scrollaxArray[1] = new Scrollax({
        target: '.paralax2',
        // move_left: 0.25,
        transform_x: 0.25,
      });
      this.scrollaxArray[2] = new Scrollax({
        target: '#ingredients > .bg',
        // move_top: 0.35,
        transform_y: 0.15,
      });
      this.scrollaxArray[3] = new Scrollax({
        target: '.mobile.prlx',
        // move_bottom: 0.3,
        transform_y: -0.3,
      });
      this.scrollaxArray[4] = new Scrollax({
        target: '#about .content .bottle',
        // move_bottom: 0.3,
        transform_y: -0.3,
      });

      //INGREDIENTS SET
      this.ingredientToggle(
        document.querySelector('#ing_sel > *:nth-child(1) > div:first-child')
      );

      // SHOP GLIDE SLIDER
      if (typeof document !== `undefined`) {
        if (document.querySelector('#onlineslider')) {
          this.slider.online = new Glide(
            '#onlineslider',
            this.glidesetting
          ).mount();
          this.sliderStatus.online = 'MOUNTED';
        }

        if (document.querySelector('#offlineslider')) {
          this.slider.offline = new Glide(
            '#offlineslider',
            this.glidesetting
          ).mount();
          this.sliderStatus.offline = 'MOUNTED';
        }

        if (document.querySelector('#stockistslider')) {
          this.slider.stockist = new Glide(
            '#stockistslider',
            this.glidesetting2
          ).mount();
          this.sliderStatus.stockist = 'MOUNTED';
        }
      }

      if (typeof document !== `undefined`) {
        // TRIGGER SCROLL SNAP INIT AND PAUSE
        this.HomeScrollSnap.init();

        this.HomeScrollSnap.pause();
        //ADD CLASS LOADED
        document.body.classList.add('loaded');
      }

      this.ForceVH = new ResponsiveVH({ target: '.fitheight' });
      this.scrollpasRetrigger();

      // FUNCTION TRIGGERS
      if (!this.state.popupReveal) {
        // SET ANIMATION DELAY
        if (this.LoadAnimationTimeout !== null)
          clearTimeout(this.LoadAnimationTimeout);
        this.LoadAnimationTimeout = setTimeout(() => {
          //ENABLE SCROLL & SNAP IF THERE IS NO POPUP
          if (this.disableScrollBody !== null) this.disableScrollBody.enable();
          this.HomeScrollSnap.play();

          // INIT RESIZE
          this.resize();

          if (this.LoadAnimationTimeout !== null)
            clearTimeout(this.LoadAnimationTimeout);
        }, this.LoadAnimationDelay);
      } else {
        //INIT POP UP
        if (this.LoadAnimationTimeout !== null)
          clearTimeout(this.LoadAnimationTimeout);
        this.LoadAnimationTimeout = setTimeout(() => {
          this.popUpRef.current.classList.remove('loading');

          if (this.disableScrollBody !== null) this.disableScrollBody.enable();
          this.popUpRef.current.classList.add('click');

          // INIT RESIZE
          this.resize();

          // ADD VARIABLE TO INDICATE FIRST VISIT
          if (typeof localStorage !== undefined)
            localStorage.popupRevealed = true;
        }, this.LoadAnimationDelay + 750);
      }
    },
  });
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
    if (typeof window !== undefined) {
      const _ap = false;
      this.AnimObject.forEach((obj, index) => {
          this.AnimObject[index].anim = lottie.loadAnimation({
            container: document.querySelector(`#${this.AnimObject[index].id_name}`),
            name: this.AnimObject[index].id_name,
            renderer: 'svg',
            loop: false,
            autoplay: _ap,
            animationData: this.AnimObject[index].animeData,
          });
          this.AnimObject[index].anim.goToAndStop(0);
      });
    }
    // SET POP UP

    // GET DATA AND LOCAL STORAGE AND SET POPUP ENABLED OR DISABLED
    // DEFAULT TO DISABLED
    if (this.popupEnable) {
      if (typeof window !== undefined) {
        if (typeof localStorage !== undefined && !localStorage.popupRevealed) {
          this.setState({ popupReveal: true });
        }
      }
      if (this.popupAlways) this.setState({ popupReveal: true });
    }
  }
  componentWillUnmount() {
    this.inviewArrayBenefits.forEach((benefit, index) => {
      if (
        this.inviewArrayBenefits[index] !== null &&
        this.inviewArrayBenefits[index] !== undefined
      ) {
        this.inviewArrayBenefits[index].kill();
        this.inviewArrayBenefits[index] = null;
      }
    });
    this.inviewArray.forEach((each, index) => {
      if (
        this.inviewArray[index] !== null &&
        this.inviewArray[index] !== undefined
      ) {
        this.inviewArray[index].kill();
        this.inviewArray[index] = null;
      }
    });

    this.scrollpass.forEach((each, index) => {
      if (
        this.scrollpass[index] !== null &&
        this.scrollpass[index] !== undefined
      ) {
        this.scrollpass[index].kill();
        this.scrollpass[index] = null;
      }
    });
    this.scrollaxArray.forEach((each, index) => {
      if (
        this.scrollaxArray[index] !== null &&
        this.scrollaxArray[index] !== undefined
      ) {
        this.scrollaxArray[index].kill();
        this.scrollaxArray[index] = null;
      }
    });

    if (typeof document !== `undefined`)
      if (this.HomeScrollSnap) this.HomeScrollSnap.kill();
    if (this.disableScrollBody !== null && this.disableScrollBody !== undefined)
      this.disableScrollBody.enable();

    if (this.slider.online !== null && this.slider.online !== undefined)
      this.slider.online.destroy();
    if (this.slider.offline !== null && this.slider.offline !== undefined)
      this.slider.offline.destroy();
    if (this.slider.stockist !== null && this.slider.stockist !== undefined)
      this.slider.stockist.destroy();

    if (this.ForceVH !== null && this.ForceVH !== undefined)
      this.ForceVH.kill();
    if (
      this.LoadAnimationTimeout !== null &&
      this.LoadAnimationTimeout !== undefined
    )
      clearTimeout(this.LoadAnimationTimeout);

    this.AnimObject.forEach((obj, index) => {
      if (
        this.AnimObject[index].anim !== null &&
        this.AnimObject[index].anim !== undefined
      ) {
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
      // document.body.classList.remove('loaded');
      window.removeEventListener('resize', this.resize, false);
    }
  }
  inviewRetrigger() {
    this.inviewArrayBenefits.forEach((benefit, index) => {
      if (
        this.inviewArrayBenefits[index] !== null &&
        this.inviewArrayBenefits[index] !== undefined
      )
        this.inviewArrayBenefits[index].trigger();
    });
    this.inviewArray.forEach((each, index) => {
      if (
        this.inviewArray[index] !== null &&
        this.inviewArray[index] !== undefined
      )
        this.inviewArray[index].trigger();
    });
  }
  scrollpasRetrigger() {
    this.scrollpass.forEach((each, index) => {
      if (
        this.scrollpass[index] !== null &&
        this.scrollpass[index] !== undefined
      ) {
        this.scrollpass[index].trigger();
      }
    });
  }
  scrollaxRetrigger() {
    this.scrollaxArray.forEach((each, index) => {
      if (
        this.scrollaxArray[index] !== null &&
        this.scrollaxArray[index] !== undefined
      ) {
        this.scrollaxArray[index].trigger();
      }
    });
  }
  resize = () => {
    //ADJUST INGREDIENTS DESCRIPTION MOBILE HEIGHT
    const ingDescMobile = document.querySelectorAll(
      '#ing_sel > span > div:last-child > div'
    );
    const offlineslider = document.querySelector('#offlineshop');
    const onlineslider = document.querySelector('#onlineshop');
    let height = [];
    ingDescMobile.forEach((desc) => {
      height.push(desc.clientHeight);
      desc.parentNode.style.height = desc.clientHeight.toString() + 'px';
    });
    if (!MediaCheck.width.mtablet()) {
      // REMOVE MENU OPEN WHEN IT IS NOT MOBILE
      document.body.classList.remove('menu_open');

      // REENABLE SLIDER
      if (onlineslider) {
        if (
          onlineslider.classList.contains('nomobileslider') &&
          this.slider.online === null &&
          this.sliderStatus.online === 'DESTROYED'
        ) {
          this.slider.online = new Glide(
            '#onlineslider',
            this.glidesetting
          ).mount();
          this.slider.online.update();
          this.sliderStatus.online = 'MOUNTED';
        }
      }

      if (offlineslider) {
        if (
          offlineslider.classList.contains('nomobileslider') &&
          this.slider.offline === null &&
          this.sliderStatus.offline === 'DESTROYED'
        ) {
          this.slider.offline = new Glide(
            '#offlineslider',
            this.glidesetting
          ).mount();
          this.slider.offline.update();
          this.sliderStatus.offline = 'MOUNTED';
        }
      }

      if (
        this.slider.stockist !== null &&
        this.sliderStatus.stockist === 'DESTROYED'
      ) {
        this.slider.stockist = new Glide(
          '#stockistslider',
          this.glidesetting2
        ).mount();
        this.slider.stockist.update();
        this.sliderStatus.stockist = 'MOUNTED';
      }
    } else {
      // CHECK AND DISABLE SLIDER ON SHOP ON MOBILE

      if (
        onlineslider.classList.contains('nomobileslider') &&
        this.slider.online !== null &&
        this.sliderStatus.online === 'MOUNTED'
      ) {
        this.slider.online.destroy();
        this.slider.online = null;
        this.sliderStatus.online = 'DESTROYED';
      }
      if (
        offlineslider.classList.contains('nomobileslider') &&
        this.slider.offline !== null &&
        this.sliderStatus.offline === 'MOUNTED'
      ) {
        this.slider.offline.destroy();
        this.slider.offline = null;
        this.sliderStatus.offline = 'DESTROYED';
      }

      if (
        this.slider.stockist !== null &&
        this.sliderStatus.stockist === 'MOUNTED'
      ) {
        this.slider.stockist.destroy();
        this.slider.stockist = null;
        this.sliderStatus.stockist = 'DESTROYED';
      }
    }
    if (this.resizeTimeout !== null) clearTimeout(this.resizeTimeout);

    this.resizeTimeout = setTimeout(() => {
      // DELAYED FUNCTION
      if (this.sliderStatus.stockist === 'MOUNTED')
        this.slider.stockist.update();

      if (this.sliderStatus.online === 'MOUNTED') this.slider.online.update();

      if (this.sliderStatus.offline === 'MOUNTED') this.slider.offline.update();

      this.resizeTimeout = null;
    }, 500);
    this.inviewRetrigger();
  };
  resizeTimeout = null;
  gotoShop = () => {
    if (MediaCheck.width.mtablet()) {
      const scrollTarget = document
        .querySelector('section#shop')
        .getBoundingClientRect().top;
      const curScrollPos =
        window.pageYOffset || document.documentElement.scrollTop;
      const wH =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.getElementsByTagName('body')[0].clientHeight;
      const dist = Math.abs(scrollTarget - curScrollPos);
      let duration = (dist / wH) * 500;
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
      const delay = MediaCheck.width.mtablet() ? 500 : 500;
      let child = target.parentNode;
      let index = 1;
      while ((child = child.previousSibling) != null) index++;
      let change = {
        number: index,
        desc: target.parentNode.dataset.desc,
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

      if (this.ingredientChangeTimeout != null)
        clearTimeout(this.ingredientChangeTimeout);
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
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        window.scrollTo(0, elTop + scrollTop);
        setTimeout(() => {
          this.scrollaxRetrigger();
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
          const shopData = data.shop.frontmatter;
          const footerData = generalData.footer;
          const transData = data.home.frontmatter.translations;
          const id_seodesc = generalData.seo.seo_shortdesc_id;
          const popupData = data.home.frontmatter.popup;

          let journalslug = generalData.journalslug;
          if (journalslug.substring(0, 1) !== '/') {
            journalslug = `/${journalslug}`;
          }

          // ONLINE AND OFFLINE SHOP VALIDITY CHECKER
          // OFFLINE SHOP OPTION
          let offlineshop = [];

          shopData.offlineshop.offlineshoplist.forEach((shop) => {
            if (
              shop.image !== null &&
              shop.image !== '' &&
              shop.image !== undefined
            ) {
              offlineshop.push(shop);
            }
          });

          let offlineshoplayout = ''; // SINGLE, SLIDER, FLOW
          if (offlineshop.length > 1) {
            offlineshoplayout = 'SLIDER';
          } else {
            offlineshoplayout = 'SINGLE';
          }
          let offlineshopemobileslider = true;
          if (shopData.offlineshop.slider_option === 'NOMOBILE')
            offlineshopemobileslider = false;

          if (
            shopData.offlineshop.slider_option === 'NOSLIDER' &&
            shopData.onlineshop.slider_option === 'NOSLIDER'
          )
            offlineshoplayout = 'NOSLIDER';

          // ONLINE SHOP OPTION
          let onlineshop = [];
          shopData.onlineshop.onlineshoplist.forEach((shop) => {
            if (
              shop.image !== null &&
              shop.image !== '' &&
              shop.image !== undefined
            ) {
              onlineshop.push(shop);
            }
          });

          let onlineshoplayout = ''; // SINGLE, SLIDER, FLOW
          if (onlineshop.length > 1) {
            onlineshoplayout = 'SLIDER';
          } else {
            onlineshoplayout = 'SINGLE';
          }
          let onlineshopemobileslider = true;
          if (shopData.onlineshop.slider_option === 'NOMOBILE')
            onlineshopemobileslider = false;
          if (
            shopData.offlineshop.slider_option === 'NOSLIDER' &&
            shopData.onlineshop.slider_option === 'NOSLIDER'
          )
            onlineshoplayout = 'NOSLIDER';

          // STOCKIST OPTION
          let stockistlayout = '';
          let stockistList = [];
          shopData.stockist.list.forEach((entry, id) => {
            if (
              entry.content !== null &&
              entry.content !== '' &&
              entry.content !== undefined
            ) {
              // CHECK LENGTH
              let sectionEntry = stockistList.length;
              let createNewSection = false;

              if (sectionEntry === 0) {
                createNewSection = true;
              } else {
                if (stockistList[sectionEntry - 1].length >= 5) {
                  createNewSection = true;
                }
              }

              if (createNewSection) {
                stockistList.push([]);
              }
              // ADD TO ENTRY
              stockistList[stockistList.length - 1].push(entry);
            }
          });

          if (stockistList.length > 2) {
            stockistlayout = 'SLIDER';
          } else {
            stockistlayout = 'SINGLE';
          }

          if (shopData.stockist.slider_option === 'NOSLIDER')
            stockistlayout = 'NOSLIDER';

          let printjournal = [];

          if (this.langID) {
            printjournal = data.journals_id;
          } else {
            printjournal = data.journals;
          }

          let exLink_PU = false;
          let popupLink = '';

          if (
            (this.langID && popupData.link.id !== null) ||
            (!this.langID && popupData.link.en !== null)
          ) {
            popupLink = this.langID ? popupData.link.id : popupData.link.en;
            if (popupLink.includes('http')) exLink_PU = true;
          }

          this.popupEnable = popupData.enable;
          this.popupAlways = popupData.always;

          return (
            <Layout
              mainClass='home'
              indonesia={this.langID}
              mainID={this.MainID}
            >
              {this.langID && (
                <Helmet>
                  {id_seodesc && (
                    <meta name='description' content={id_seodesc} />
                  )}
                  {id_seodesc && (
                    <meta property='og:description' content={id_seodesc} />
                  )}
                  {id_seodesc && (
                    <meta name='twitter:description' content={id_seodesc} />
                  )}
                </Helmet>
              )}
              <MobileHomeHeader indonesia={this.langID} />
              <div id='MobileNavigation'>
                <div>
                  <div
                    className='menubutton'
                    onClick={(e) => this.menuToggle(e)}
                  >
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
                <div>
                  <div>
                    <div
                      className='closebutton'
                      onClick={(e) => this.menuToggle(e)}
                    >
                      <span />
                      <span />
                    </div>
                  </div>
                  <div className='fitheight'>
                    <div>
                      <span onClick={(e) => this.mobileScroll(e)}>
                        {this.langID
                          ? transData.home.title.id
                          : transData.home.title.en}
                      </span>
                      <span onClick={(e) => this.mobileScroll(e)}>
                        {this.langID
                          ? transData.about.title.id
                          : transData.about.title.en}
                      </span>
                      <span onClick={(e) => this.mobileScroll(e)}>
                        {this.langID
                          ? transData.benefits.title.id
                          : transData.benefits.title.en}
                      </span>
                      <span onClick={(e) => this.mobileScroll(e)}>
                        {this.langID
                          ? transData.ingredients.title.id
                          : transData.ingredients.title.en}
                      </span>
                      <span onClick={(e) => this.mobileScroll(e)}>
                        {this.langID
                          ? transData.shop.title.id
                          : transData.shop.title.en}
                      </span>

                      {!data.general.frontmatter.journaldisable && (
                        <span onClick={(e) => this.mobileScroll(e)}>
                          {this.langID
                            ? transData.journal.title.id
                            : transData.journal.title.en}
                        </span>
                      )}
                      <div>
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
                              href={`https://api.whatsapp.com/send?phone=${footerData.wa_no}`}
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
                    </div>
                  </div>
                </div>
              </div>
              <div className='overlay_wrapper'>
                <div className='overlay'>
                  <div className='wrapper'>
                    <div>
                      <Link
                        aria-label='English'
                        className={`${!this.props.langID && 'disable'}`}
                        to='/'
                      >
                        EN
                      </Link>
                      <Link
                        aria-label='Indonesia'
                        className={`${this.props.langID && 'disable'}`}
                        to='/id'
                      >
                        ID
                      </Link>
                    </div>
                    <div className='right_nav'>
                      <div className='snap_nav'>
                        <span>
                          <span>
                            {this.langID
                              ? transData.home.title.id
                              : transData.home.title.en}
                          </span>
                        </span>
                        <span className='active'>
                          <span>
                            {this.langID
                              ? transData.about.title.id
                              : transData.about.title.en}
                          </span>
                        </span>
                        <span>
                          <span>
                            {this.langID
                              ? transData.benefits.title.id
                              : transData.benefits.title.en}
                          </span>
                        </span>
                        <span>
                          <span>
                            {this.langID
                              ? transData.ingredients.title.id
                              : transData.ingredients.title.en}
                          </span>
                        </span>
                        <span>
                          <span>
                            {this.langID
                              ? transData.shop.title.id
                              : transData.shop.title.en}
                          </span>
                        </span>
                        {!data.general.frontmatter.journaldisable && (
                          <span>
                            <span>
                              {this.langID
                                ? transData.journal.title.id
                                : transData.journal.title.en}
                            </span>
                          </span>
                        )}
                      </div>
                      <div className='social_ctn'>
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
                            href={`https://api.whatsapp.com/send?phone=${footerData.wa_no}`}
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
                  </div>
                </div>
                <div className='bottlesection_wrapper'>
                  <div className='greenline' />
                  <div className='bottlewrapper'>
                    <div>
                      <picture>
                        <source srcSet={BottleImgWebP} type='image/webp' />
                        <source srcSet={BottleImg} type='image/png' />
                        <img src={BottleImg} alt='Herbamojo' />
                      </picture>
                      <span
                        id='ShopButton'
                        className='hide'
                        onClick={this.gotoShop}
                      >
                        {this.langID
                          ? transData.home.shopfloat.id
                          : transData.home.shopfloat.en}
                      </span>
                    </div>
                  </div>
                  <section id='home'>
                    <div className='wrapper'>
                      <h1 className='hidden'>{generalData.web_name}</h1>
                      <span className='logo'>
                        <img src={HerbamojoLogo} alt='herbamojo' />
                      </span>
                      <div className='content'>
                        <span>
                          {this.langID
                            ? transData.home.kys.id.know
                            : transData.home.kys.en.know}
                        </span>
                        <span>
                          {this.langID
                            ? transData.home.kys.id.your
                            : transData.home.kys.en.your}
                        </span>
                        <span>
                          {this.langID
                            ? transData.home.kys.id.strength
                            : transData.home.kys.en.strength}
                        </span>
                        <span id='GetButton' onClick={this.gotoShop}>
                          {this.langID
                            ? transData.home.getyours.id
                            : transData.home.getyours.en}
                        </span>
                      </div>
                    </div>
                    <div className='bg'>
                      {/* <img
                        className='paralax1'
                        src={homeData.home.background}
                        alt='herbamojo'
                      /> */}
                      <GatsbyImage
                        image={homeData.home.background.childImageSharp.gatsbyImageData}
                        className='paralax1'
                        alt='herbamojo'
                        imgStyle={{
                          objectFit: 'cover',
                          objectPosition: 'right',
                        }}
                        loading='eager'
                        fadeIn={false} />
                      {/* <img
                        className='mobile prlx'
                        src={homeData.home.backgroundmobile}
                        alt='herbamojo'
                      /> */}
                      <GatsbyImage
                        image={homeData.home.backgroundmobile.childImageSharp.gatsbyImageData}
                        className='mobile prlx'
                        imgStyle={{
                          objectFit: 'contain',
                          objectPosition: 'center',
                        }}
                        loading='eager'
                        fadeIn={false}
                        alt='herbamojo' />
                    </div>
                  </section>
                  <section id='about'>
                    <div className='wrapper'>
                      <h1>
                        {this.langID
                          ? transData.about.title.id
                          : transData.about.title.en}
                      </h1>
                      <div className='content half flex '>
                        <div className='logo'>
                          <img src={HerbamojoLogo} alt='herbamojo' />
                        </div>
                        <div className='bottle'>
                          <picture>
                            <source srcSet={BottleImgWebP} type='image/webp' />
                            <source srcSet={BottleImg} type='image/png' />
                            <img src={BottleImg} alt='Herbamojo' />
                          </picture>
                        </div>
                        <div className='description'>
                          {this.langID
                            ? homeData.about.desc.id
                            : homeData.about.desc.en}
                        </div>
                        <div className='certification'>
                          <div>
                            <img src={CertNatural} alt='herbamojo' />
                            <span>
                              {this.langID
                                ? transData.about.cert.natural.id
                                : transData.about.cert.natural.en}
                            </span>
                          </div>

                          <div>
                            <img src={CertBPOM} alt='herbamojo' />
                            <span>
                              {this.langID
                                ? transData.about.cert.bpom.id
                                : transData.about.cert.bpom.en}
                            </span>
                          </div>

                          <div>
                            <img src={CertHalal} alt='herbamojo' />
                            <span>
                              {this.langID
                                ? transData.about.cert.halal.id
                                : transData.about.cert.halal.en}
                            </span>
                          </div>

                          <div>
                            <img src={CertQuality} alt='herbamojo' />
                            <span>
                              {this.langID
                                ? transData.about.cert.quality.id
                                : transData.about.cert.quality.en}
                            </span>
                          </div>
                          <div>
                            <img src={CertResearch} alt='herbamojo' />
                            <span>
                              {this.langID
                                ? transData.about.cert.expert.id
                                : transData.about.cert.expert.en}
                            </span>
                          </div>

                          <div>
                            <img src={CertQuadra} alt='herbamojo' />
                            <span>
                              {this.langID
                                ? transData.about.cert.quadra.id
                                : transData.about.cert.quadra.en}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='bg'>
                      {/* <img
                        className='paralax2'
                        src={homeData.about.background}
                        alt='herbamojo'
                      /> */}

                      <div className='wrapper'>
                        <GatsbyImage
                          image={homeData.about.background.childImageSharp.gatsbyImageData}
                          className='paralax2'
                          imgStyle={{
                            objectFit: 'cover',
                            objectPosition: 'center',
                          }}
                          alt='herbamojo'
                          loading='eager'
                          fadeIn={false} />
                      </div>
                    </div>
                  </section>
                  <section id='benefits'>
                    <div className='wrapper'>
                      <h1>
                        {this.langID
                          ? transData.benefits.title.id
                          : transData.benefits.title.en}
                      </h1>
                      <div className='content half flex'>
                        <div>
                          <div>
                            <div id={this.AnimObject[0].id_name} />
                            <div>
                              <span>
                                {this.langID
                                  ? transData.benefits.stamina.id.line1
                                  : transData.benefits.stamina.en.line1}
                              </span>
                              <span>
                                {this.langID
                                  ? transData.benefits.stamina.id.line2
                                  : transData.benefits.stamina.en.line2}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div id={this.AnimObject[1].id_name} />
                            <div>
                              <span>
                                {this.langID
                                  ? transData.benefits.increases.id.line1
                                  : transData.benefits.increases.en.line1}
                              </span>
                              <span>
                                {this.langID
                                  ? transData.benefits.increases.id.line2
                                  : transData.benefits.increases.en.line2}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div id={this.AnimObject[2].id_name} />
                            <div>
                              <span>
                                {this.langID
                                  ? transData.benefits.immune.id.line1
                                  : transData.benefits.immune.en.line1}
                              </span>
                              <span>
                                {this.langID
                                  ? transData.benefits.immune.id.line2
                                  : transData.benefits.immune.en.line2}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div id={this.AnimObject[3].id_name} />
                            <div>
                              <span>
                                {this.langID
                                  ? transData.benefits.enhance.id.line1
                                  : transData.benefits.enhance.en.line1}
                              </span>
                              <span>
                                {this.langID
                                  ? transData.benefits.enhance.id.line2
                                  : transData.benefits.enhance.en.line2}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
                <section id='ingredients'>
                  <div className='wrapper'>
                    <h1>
                      {this.langID
                        ? transData.ingredients.title.id
                        : transData.ingredients.title.en}
                    </h1>
                    <div className='content flex'>
                      <div id='ing_sel'>
                        {homeData.ingredients.map((node, id) => {
                          return (
                            <span
                              key={id}
                              className='active'
                              data-desc={
                                this.langID ? node.desc.id : node.desc.en
                              }
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
                                <div>
                                  {this.langID ? node.desc.id : node.desc.en}
                                </div>
                              </div>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <div id='ing_display'>
                        <div id='ing_display_number'>1</div>
                        <div id='ing_display_description'>
                          {this.langID
                            ? homeData.ingredients[0].desc.id
                            : homeData.ingredients[0].desc.en}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='bg'>
                    <div id='ing_bg'>
                      {/* <img key={id} src={node.image} alt='herbamojo' /> */}
                      {homeData.ingredients.map((node, id) => {
                        return (
                          <GatsbyImage
                            image={node.image.childImageSharp.gatsbyImageData}
                            imgStyle={{
                              objectFit: 'scale-down',
                              objectPosition: 'right center',
                            }}
                            key={id}
                            alt='herbamojo'
                            loading='eager'
                            fadeIn={false} />
                        );
                      })}
                    </div>
                  </div>
                </section>
                <section id='shop'>
                  <div className='wrapper'>
                    <h1>
                      {this.langID
                        ? transData.shop.title.id
                        : transData.shop.title.en}
                    </h1>
                    <div>
                      <div className='content flex'>
                        {onlineshop[0].image !== '' && (
                          <div>
                            <h2>
                              {this.langID
                                ? transData.shop.online.id
                                : transData.shop.online.en}
                            </h2>
                            <div
                              id='onlineshop'
                              className={`shopSlider ${
                                onlineshop.length === 1 ? 'oneslide' : ''
                              } ${
                                !onlineshopemobileslider ? 'nomobileslider' : ''
                              }`}
                            >
                              {
                                {
                                  NOSLIDER: (
                                    <div className='wrapper noslider'>
                                      {onlineshop.map((node, id) => {
                                        return (
                                          <div
                                            className='shop'
                                            key={id}
                                            dataid={id}
                                          >
                                            {node.link ? (
                                              <a
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                href={node.link}
                                                style={{
                                                  background:
                                                    node.background !== null
                                                      ? node.background
                                                      : 'transparent',
                                                }}
                                                aria-label='Shop Slider'
                                              >
                                                <ShopImages
                                                  fluid={
                                                    node.image.childImageSharp.gatsbyImageData
                                                  }
                                                />
                                              </a>
                                            ) : (
                                              <div
                                                style={{
                                                  background:
                                                    node.background !== null
                                                      ? node.background
                                                      : 'transparent',
                                                }}
                                              >
                                                <ShopImages
                                                  fluid={
                                                    node.image.childImageSharp.gatsbyImageData
                                                  }
                                                />
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ),
                                  SINGLE: (
                                    <>
                                      <div className='arrow'>
                                        <Arrow />
                                        <ArrowSmaller classProps='mobile' />
                                      </div>
                                      {/* CONTENT */}
                                      <div className='wrapper'>
                                        {onlineshop.map((node, id) => {
                                          return (
                                            <div
                                              className='shop'
                                              key={id}
                                              dataid={id}
                                            >
                                              {node.link ? (
                                                <a
                                                  target='_blank'
                                                  rel='noopener noreferrer'
                                                  href={node.link}
                                                  style={{
                                                    background:
                                                      node.background !== null
                                                        ? node.background
                                                        : 'transparent',
                                                  }}
                                                  aria-label='Shop Slider'
                                                >
                                                  <ShopImages
                                                    fluid={
                                                      node.image.childImageSharp.gatsbyImageData
                                                    }
                                                  />
                                                </a>
                                              ) : (
                                                <div
                                                  style={{
                                                    background:
                                                      node.background !== null
                                                        ? node.background
                                                        : 'transparent',
                                                  }}
                                                >
                                                  <ShopImages
                                                    fluid={
                                                      node.image.childImageSharp.gatsbyImageData
                                                    }
                                                  />
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                      <div className='arrow'>
                                        <Arrow />
                                        <ArrowSmaller classProps='mobile' />
                                      </div>
                                    </>
                                  ),
                                  SLIDER: (
                                    <>
                                      <div
                                        className='arrow'
                                        onClick={() => {
                                          if (this.slider.online)
                                            this.slider.online.go('<');
                                        }}
                                      >
                                        <Arrow />
                                        <ArrowSmaller classProps='mobile' />
                                      </div>
                                      {/* CONTENT */}
                                      <div
                                        id='onlineslider'
                                        className='glide wrapper'
                                      >
                                        <div
                                          data-glide-el='track'
                                          className='glide__track'
                                        >
                                          <div className='glide__slides '>
                                            {onlineshop.map((node, id) => {
                                              return (
                                                <div
                                                  className='shop glide__slide'
                                                  key={id}
                                                  dataid={id}
                                                >
                                                  {node.link ? (
                                                    <a
                                                      target='_blank'
                                                      rel='noopener noreferrer'
                                                      href={node.link}
                                                      style={{
                                                        background:
                                                          node.background !==
                                                          null
                                                            ? node.background
                                                            : 'transparent',
                                                      }}
                                                      aria-label='Shop Slider'
                                                    >
                                                      <ShopImages
                                                        fluid={
                                                          node.image
                                                            .childImageSharp.gatsbyImageData
                                                        }
                                                      />
                                                    </a>
                                                  ) : (
                                                    <div
                                                      style={{
                                                        background:
                                                          node.background !==
                                                          null
                                                            ? node.background
                                                            : 'transparent',
                                                      }}
                                                    >
                                                      <ShopImages
                                                        fluid={
                                                          node.image
                                                            .childImageSharp.gatsbyImageData
                                                        }
                                                      />
                                                    </div>
                                                  )}
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                      <div
                                        className='arrow'
                                        onClick={() => {
                                          if (this.slider.online)
                                            this.slider.online.go('>');
                                        }}
                                      >
                                        <Arrow />
                                        <ArrowSmaller classProps='mobile' />
                                      </div>
                                    </>
                                  ),
                                }[onlineshoplayout]
                              }
                            </div>
                          </div>
                        )}
                        {offlineshop[0].image !== '' && (
                          <div>
                            <h2>
                              {this.langID
                                ? transData.shop.offline.id
                                : transData.shop.offline.en}
                            </h2>
                            <div
                              id='offlineshop'
                              className={`shopSlider ${
                                offlineshop.length === 1 ? ' oneslide' : ''
                              } ${
                                !offlineshopemobileslider
                                  ? 'nomobileslider'
                                  : ''
                              }`}
                            >
                              {
                                {
                                  NOSLIDER: (
                                    <div className='wrapper noslider'>
                                      {offlineshop.map((node, id) => {
                                        return (
                                          <div
                                            className='shop'
                                            key={id}
                                            dataid={id}
                                          >
                                            {node.link ? (
                                              <a
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                href={node.link}
                                                style={{
                                                  background:
                                                    node.background !== null
                                                      ? node.background
                                                      : 'transparent',
                                                }}
                                                aria-label='Shop Slider'
                                              >
                                                <ShopImages
                                                  fluid={
                                                    node.image.childImageSharp.gatsbyImageData
                                                  }
                                                />
                                              </a>
                                            ) : (
                                              <div
                                                style={{
                                                  background:
                                                    node.background !== null
                                                      ? node.background
                                                      : 'transparent',
                                                }}
                                              >
                                                <ShopImages
                                                  fluid={
                                                    node.image.childImageSharp.gatsbyImageData
                                                  }
                                                />
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ),
                                  SINGLE: (
                                    <>
                                      <div className='arrow'>
                                        <Arrow />
                                        <ArrowSmaller classProps='mobile' />
                                      </div>
                                      {/* CONTENT */}
                                      <div className='wrapper'>
                                        {offlineshop.map((node, id) => {
                                          return (
                                            <div
                                              className='shop'
                                              key={id}
                                              dataid={id}
                                            >
                                              {node.link ? (
                                                <a
                                                  target='_blank'
                                                  rel='noopener noreferrer'
                                                  href={node.link}
                                                  style={{
                                                    background:
                                                      node.background !== null
                                                        ? node.background
                                                        : 'transparent',
                                                  }}
                                                  aria-label='Shop Slider'
                                                >
                                                  <ShopImages
                                                    fluid={
                                                      node.image.childImageSharp.gatsbyImageData
                                                    }
                                                  />
                                                </a>
                                              ) : (
                                                <div
                                                  style={{
                                                    background:
                                                      node.background !== null
                                                        ? node.background
                                                        : 'transparent',
                                                  }}
                                                >
                                                  <ShopImages
                                                    fluid={
                                                      node.image.childImageSharp.gatsbyImageData
                                                    }
                                                  />
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                      <div className='arrow'>
                                        <Arrow />
                                        <ArrowSmaller classProps='mobile' />
                                      </div>
                                    </>
                                  ),
                                  SLIDER: (
                                    <>
                                      <div
                                        className='arrow'
                                        onClick={() => {
                                          if (this.slider.offline)
                                            this.slider.offline.go('<');
                                        }}
                                      >
                                        <Arrow />
                                        <ArrowSmaller classProps='mobile' />
                                      </div>
                                      {/* CONTENT */}
                                      <div
                                        id='offlineslider'
                                        className='glide wrapper'
                                      >
                                        <div
                                          data-glide-el='track'
                                          className='glide__track'
                                        >
                                          <div className='glide__slides '>
                                            {offlineshop.map((node, id) => {
                                              return (
                                                <div
                                                  className='shop glide__slide'
                                                  key={id}
                                                  dataid={id}
                                                >
                                                  {node.link ? (
                                                    <a
                                                      target='_blank'
                                                      rel='noopener noreferrer'
                                                      href={node.link}
                                                      style={{
                                                        background:
                                                          node.background !==
                                                          null
                                                            ? node.background
                                                            : 'transparent',
                                                      }}
                                                      aria-label='Shop Slider'
                                                    >
                                                      <ShopImages
                                                        fluid={
                                                          node.image
                                                            .childImageSharp.gatsbyImageData
                                                        }
                                                      />
                                                    </a>
                                                  ) : (
                                                    <div
                                                      style={{
                                                        background:
                                                          node.background !==
                                                          null
                                                            ? node.background
                                                            : 'transparent',
                                                      }}
                                                    >
                                                      <ShopImages
                                                        fluid={
                                                          node.image
                                                            .childImageSharp.gatsbyImageData
                                                        }
                                                      />
                                                    </div>
                                                  )}
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                      <div
                                        className='arrow'
                                        onClick={() => {
                                          if (this.slider.offline)
                                            this.slider.offline.go('>');
                                        }}
                                      >
                                        <Arrow />
                                        <ArrowSmaller classProps='mobile' />
                                      </div>
                                    </>
                                  ),
                                }[offlineshoplayout]
                              }
                            </div>
                          </div>
                        )}
                        {stockistList.length > 0 ? (
                          <div>
                            <h2>
                              {this.langID
                                ? transData.shop.stockist.id
                                : transData.shop.stockist.en}</h2>
                            <div
                              id='stockist'
                              className={`shopSlider stockist ${
                                stockistList.length <= 2 ? ' oneslide' : ''
                              } ${
                                !onlineshopemobileslider ? 'nomobileslider' : ''
                              }`}
                            >
                              {
                                {
                                  SINGLE: (
                                    <>
                                      <div className='arrow'>
                                        <Arrow />
                                        <ArrowSmaller classProps='mobile' />
                                      </div>
                                      {/* CONTENT */}
                                      <div
                                        id='stockistslider '
                                        className='glide wrapper '
                                      >
                                        {stockistList.map((section, id) => {
                                          return (
                                            <div
                                              className='stockist glide__slide'
                                              key={id}
                                              dataid={id}
                                            >
                                              {section.map((entry, entryid) => {
                                                if (entry.link !== '') {
                                                  return (
                                                    <a
                                                      href={entry.link}
                                                      key={entryid}
                                                      dataid={entryid}
                                                    >
                                                      {entry.content}
                                                    </a>
                                                  );
                                                } else {
                                                  return (
                                                    <span
                                                      key={entryid}
                                                      dataid={entryid}
                                                    >
                                                      {entry.content}
                                                    </span>
                                                  );
                                                }
                                              })}
                                            </div>
                                          );
                                        })}
                                      </div>
                                      <div className='arrow'>
                                        <Arrow />
                                        <ArrowSmaller classProps='mobile' />
                                      </div>
                                    </>
                                  ),
                                  SLIDER: (
                                    <>
                                      <div
                                        className='arrow'
                                        onClick={() => {
                                          if (this.slider.stockist)
                                            this.slider.stockist.go('<');
                                        }}
                                      >
                                        <Arrow />
                                        <ArrowSmaller classProps='mobile' />
                                      </div>
                                      {/* CONTENT */}
                                      <div
                                        id='stockistslider'
                                        className='glide wrapper'
                                      >
                                        <div
                                          data-glide-el='track'
                                          className='glide__track'
                                        >
                                          <div className='glide__slides '>
                                            {stockistList.map((section, id) => {
                                              return (
                                                <div
                                                  className='stockist glide__slide'
                                                  key={id}
                                                  dataid={id}
                                                >
                                                  {section.map(
                                                    (entry, entryid) => {
                                                      if (entry.link !== '') {
                                                        return (
                                                          <a
                                                            href={entry.link}
                                                            key={entryid}
                                                            dataid={entryid}
                                                          >
                                                            {entry.content}
                                                          </a>
                                                        );
                                                      } else {
                                                        return (
                                                          <span
                                                            key={entryid}
                                                            dataid={entryid}
                                                          >
                                                            {entry.content}
                                                          </span>
                                                        );
                                                      }
                                                    }
                                                  )}
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                      <div
                                        className='arrow'
                                        onClick={() => {
                                          if (this.slider.stockist)
                                            this.slider.stockist.go('>');
                                        }}
                                      >
                                        <Arrow />
                                        <ArrowSmaller classProps='mobile' />
                                      </div>
                                    </>
                                  ),
                                }[stockistlayout]
                              }
                            </div>
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </div>
                </section>
                {!data.general.frontmatter.journaldisable && (
                  <section id='journal' className='journallist'>
                    <div className='wrapper'>
                      <h1>
                        {this.langID
                          ? transData.journal.title.id
                          : transData.journal.title.en}
                      </h1>

                      <div className='content flex'>
                        <div className='__journalcontainer'>
                          {printjournal.edges.map((journal, id) => {
                            let getColorstat =
                              journal.node.frontmatter.listcolorblack;
                            if (
                              typeof journal.node.frontmatter.listcolorblack ===
                              'string'
                            ) {
                              getColorstat =
                                journal.node.frontmatter.listcolorblack ===
                                'true'
                                  ? true
                                  : false;
                            }
                            return (
                              <Link
                                key={journal.node.id}
                                to={journal.node.fields.slug}
                                className={getColorstat ? 'black' : ''}
                              >
                                <div>
                                  <span>{journal.node.frontmatter.date}</span>
                                  <h2>{journal.node.frontmatter.title}</h2>
                                </div>
                                <GatsbyImage
                                  image={journal.node.frontmatter.thumbimage.childImageSharp.gatsbyImageData}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                  }}
                                  imgStyle={{
                                    width: '100%',
                                    height: '100%',
                                  }}
                                  loading='eager'
                                  fadeIn={false} />
                              </Link>
                            );
                          })}
                        </div>
                        {printjournal.edges.length >= 4 && (
                          <Link
                            className='viewall'
                            to={
                              this.langID
                                ? `/id${journalslug}`
                                : `${journalslug}`
                            }
                            aria-label='Go to Journal'
                          >
                            <span>
                              {this.langID
                                ? transData.journal.viewall.id
                                : transData.journal.viewall.en}
                            </span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </section>
                )}
              </div>
              <Footer indonesia={this.langID} />
              {this.state.popupReveal && (
                <div
                  id='PopUpWrapper'
                  ref={this.popUpRef}
                  className={`loading ${this.popupEnable ? 'popup' : ''}`}
                  onClick={(e) => {
                    if (
                      !e.currentTarget
                        .querySelector('.container')
                        .contains(e.target)
                    ) {
                      this.closePopUp();
                    }
                  }}
                >
                  <div className='container' ref={this.popUpRefContainer}>
                    <div className='background'>
                      <GatsbyImage
                        image={popupData.image.childImageSharp.gatsbyImageData}
                        alt='popupimage'
                        imgStyle={{
                          objectFit: 'cover',
                          objectPosition: 'center',
                          width: '100%',
                          height: '100%',
                        }}
                        loading='eager' />
                    </div>
                    <div>
                      <div className='content'>
                        <div className='heading'>
                          {this.langID
                            ? popupData.content.id
                            : popupData.content.en}
                        </div>
                        {popupLink ? (
                          exLink_PU ? (
                            <a href={popupLink}>
                              {this.langID
                                ? popupData.buttontext.id
                                : popupData.buttontext.en}
                            </a>
                          ) : (
                            <Link to={popupLink}>
                              {this.langID
                                ? popupData.buttontext.id
                                : popupData.buttontext.en}
                            </Link>
                          )
                        ) : (
                          ''
                        )}

                        <div
                          id='PopUpClose'
                          className='close'
                          onClick={this.closePopUp}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Layout>
          );
        }}
      />
    );
  }
}

const indexQuery = graphql`{
  journals: allMarkdownRemark(
    filter: {frontmatter: {issetting: {eq: false}, contenttype: {eq: "journal"}, indonesia: {eq: false}, active: {eq: true}}}
    sort: {fields: [frontmatter___date], order: DESC}
    limit: 4
  ) {
    edges {
      node {
        id
        frontmatter {
          title
          date(formatString: "DD/MM/YY")
          listcolorblack
          thumbimage {
            childImageSharp {
              gatsbyImageData(placeholder: BLURRED, layout: FULL_WIDTH)
            }
          }
        }
        fields {
          slug
        }
        excerpt
      }
    }
  }
  journals_id: allMarkdownRemark(
    filter: {frontmatter: {issetting: {eq: false}, contenttype: {eq: "journal"}, indonesia: {eq: true}, active: {eq: true}}}
    sort: {fields: [frontmatter___date], order: DESC}
    limit: 4
  ) {
    edges {
      node {
        id
        frontmatter {
          title
          date(formatString: "DD/MM/YY")
          listcolorblack
          thumbimage {
            childImageSharp {
              gatsbyImageData(placeholder: BLURRED, layout: FULL_WIDTH)
            }
          }
        }
        fields {
          slug
        }
        excerpt
      }
    }
  }
  general: markdownRemark(
    frontmatter: {issetting: {eq: true}, contenttype: {eq: "general_setting"}}
  ) {
    frontmatter {
      web_name
      journaldisable
      journalslug
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
  shop: markdownRemark(
    frontmatter: {issetting: {eq: true}, contenttype: {eq: "homeshop_setting"}}
  ) {
    frontmatter {
      onlineshop {
        onlineshoplist {
          image {
            childImageSharp {
              gatsbyImageData(
                width: 500
                quality: 100
                placeholder: BLURRED
                layout: CONSTRAINED
              )
            }
          }
          link
          background
        }
        slider_option
      }
      offlineshop {
        offlineshoplist {
          image {
            childImageSharp {
              gatsbyImageData(
                width: 500
                quality: 100
                placeholder: BLURRED
                layout: CONSTRAINED
              )
            }
          }
          link
          background
        }
        slider_option
      }
      stockist {
        list {
          content
          link
        }
        slider_option
      }
    }
  }
  home: markdownRemark(
    frontmatter: {issetting: {eq: true}, contenttype: {eq: "home_setting"}}
  ) {
    frontmatter {
      title
      home {
        background {
          childImageSharp {
            gatsbyImageData(placeholder: BLURRED, layout: FULL_WIDTH)
          }
        }
        backgroundmobile {
          childImageSharp {
            gatsbyImageData(placeholder: BLURRED, layout: FULL_WIDTH)
          }
        }
      }
      popup {
        enable
        always
        image {
          childImageSharp {
            gatsbyImageData(placeholder: BLURRED, layout: FULL_WIDTH)
          }
        }
        content {
          en
          id
        }
        link {
          en
          id
        }
        buttontext {
          en
          id
        }
      }
      about {
        background {
          childImageSharp {
            gatsbyImageData(placeholder: BLURRED, layout: FULL_WIDTH)
          }
        }
        desc {
          en
          id
        }
      }
      ingredients {
        image {
          childImageSharp {
            gatsbyImageData(placeholder: BLURRED, layout: FULL_WIDTH)
          }
        }
        title {
          en
          id
        }
        desc {
          en
          id
        }
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
          stockist {
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
