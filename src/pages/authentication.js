import React, { useEffect, useState, useLayoutEffect } from 'react';
import { StaticQuery, Link, graphql } from 'gatsby';
import lottie from 'lottie-web';
import Layout from 'components/layout';
import Footer from 'components/footer';
import 'stylesheet/aut.scss';
import PageHeader from 'components/pageheader';
import gsap from 'gsap';

import { InViewportClass, ScrollPassClass } from 'utils/inviewport';
import { ScrollSnapClass } from 'utils/scrollsnap';

import { LoaderClass } from 'utils/loader';
import { DisableScroll } from 'utils/disablescroll';
import { ConnectionSpeed, MediaCheck } from 'utils/mediacheck';
import { transformValue } from 'utils/mathTransformer';
import { ResponsiveVH } from 'utils/responsive-vh';
import BottleJson from 'animationdata/autbottle_split.json';
// import BottleImages from 'animationdata/autbottle.json';

import SealImg from 'images/static/aut/herbamojo_bottle_seal.png';
import BottleFrontImg from 'images/static/aut/herbamojo_bottle_front.jpg';
import BottleBackImg from 'images/static/aut/herbamojo_bottle_back.jpg';
import BottleSideImg from 'images/static/aut/herbamojo_bottle_side.jpg';
import CapsuleImg from 'images/static/aut/capsule.png';
import JamuImg from 'images/static/aut/jamu.png';

import SealImgWebp from 'images/static/aut/herbamojo_bottle_seal.webp';
import BottleFrontImgWebp from 'images/static/aut/herbamojo_bottle_front.webp';
import BottleBackImgWebp from 'images/static/aut/herbamojo_bottle_back.webp';
import BottleSideImgWebp from 'images/static/aut/herbamojo_bottle_side.webp';
import CapsuleImgWebp from 'images/static/aut/capsule.webp';
import JamuImgWebp from 'images/static/aut/jamu.webp';

let SnapNav = null;
let autDataQuery = null;
let LoadAnimationDelay = 3500;
let LoadAnimationTimeout = null;

export default function AuthenticationPage(props) {
  let inviewinit = false;
  let bottleLottie = null;
  let AutScrollSnap, ForceVH;
  let disableScrollBody = null;

  const LangID = props.langID || false;
  const MainID = `aut${LangID ? 'id' : 'en'}`;
  const AutInviewArray = [];

  const [AutTitleState, setAutTitleState] = useState('TITLE');

  // CHANGE TITLE FUNCTION
  const AutTitle = {
    timeout: null,
    delay: 300,
    init: () => {
      if (autDataQuery)
        setAutTitleState(
          LangID ? autDataQuery.section1.id : autDataQuery.section1.en
        );
    },
    adjustWidth: () => {
      if (inviewinit) {
        const AutTitleCont = document.querySelector('#AutTitle');
        if (AutTitleCont) {
          const innerSpan = AutTitleCont.querySelector('span');
          AutTitleCont.style.width = `${innerSpan.clientWidth}px`;
        }
      }
    },
    set: (title) => {
      const AutTitleCont = document.querySelector('#AutTitle');
      const innerSpan = AutTitleCont.querySelector('span');
      if (inviewinit) {
        if (innerSpan.innerHTML !== title) {
          AutTitleCont.classList.add('transition');
          if (AutTitle.timeout !== null) clearTimeout(AutTitle.timeout);
          AutTitle.timeout = setTimeout(() => {
            setAutTitleState(title);
            AutTitle.adjustWidth();
            AutTitleCont.classList.remove('transition');
          }, AutTitle.delay);
        }
      } else {
        inviewinit = true;
        setAutTitleState(title);
        if (AutTitle.timeout !== null) clearTimeout(AutTitle.timeout);
        AutTitle.timeout = setTimeout(() => {
          AutTitleCont.style.width = `${innerSpan.clientWidth}px`;
          AutTitleCont.classList.remove('transition');
        }, 1);
      }
    },
  };

  // RESIZE FUNCTIONS
  const AutResize = {
    run: () => {
      if (typeof window !== undefined) {
        // DIRECT CODE
        if (AutResize.timeout !== null) clearTimeout(AutResize.timeout);
        AutResize.timeout = setTimeout(() => {
          // DELAYED CODE
          AutBottleAnim.setFromScroll();
          AutTitle.adjustWidth();
          // CLEAR TIUMEOUT
          clearTimeout(AutResize.timeout);
          AutResize.timeout = null;
        }, 500);
      }
    },
    timeout: null,
  };

  // BOTTLE ANIMATIONS
  const AutBottleAnim = {
    frame: {
      current: 1,
      target: 1,
    },
    playing: false,
    disable: false,
    playUntil: (target) => {
      if (AutBottleAnim.frame.target !== target) {
        AutBottleAnim.frame.target = target;
        AutBottleAnim.play();
      }
    },
    play: () => {
      // CHECK IF ANIMATION IS ENABLED;
      if (!AutBottleAnim.disable && bottleLottie) {
        const speed = Math.min(
          Math.max(
            (Math.abs(
              AutBottleAnim.frame.target - AutBottleAnim.frame.current
            ) /
              35) *
              2,
            2
          ),
          5
        );

        AutBottleAnim.refreshDirection();
        bottleLottie.setSpeed(speed);
        if (!AutBottleAnim.playing) {
          AutBottleAnim.playing = true;
          // bottleLottie.play();
        }
      }
    },
    step: (frame) => {
      if (!AutBottleAnim.disable && bottleLottie) {
        requestAnimationFrame(() => bottleLottie.goToAndStop(frame, true));
      }
    },
    refreshDirection: () => {
      const direction = Math.sign(
        AutBottleAnim.frame.target - AutBottleAnim.frame.current
      );
      if (direction !== 0) bottleLottie.setDirection(direction);
    },
    checkDisable: (afterCheck) => {
      if (ConnectionSpeed() === 'SLOW') {
        AutBottleAnim.disable = true;
      } else if (ConnectionSpeed() === 'ERROR') {
        // DO CHECK BASED ON DEVICE
        if (
          /Android|webOS|iPhone|iPod|iPad|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          )
        ) {
          // true for mobile device
          AutBottleAnim.disable = true;
          // ALTERNATIVE CHECK
          const userImageLink =
            '/assets/images/herbamojo_productshot3.jpg' + '?n=' + Math.random();
          let time_start, end_time;

          // The size in bytes
          const downloadSize = 93.67 * 1024;
          let downloadImgSrc = new Image();

          downloadImgSrc.onload = function () {
            console.log('image source download');
            end_time = new Date().getTime();
            const speedInKbps =
              ((downloadSize * 8) / (end_time - time_start) / 1024) * 1000;

            if (typeof window !== undefined) {
              if (
                speedInKbps > 200 &&
                !document.body.classList.contains('loaded')
              )
                AutBottleAnim.disable = false;
            }
            // ;
            downloadImgSrc = null;
          };

          time_start = new Date().getTime();
          downloadImgSrc.src = userImageLink;
        }
      }
      if (afterCheck && typeof afterCheck === 'function') afterCheck();
    },
    init: (props) => {
      AutBottleAnim.checkDisable(() => {
        if (!AutBottleAnim.disable) {
          if (typeof window !== 'undefined' && typeof document !== 'undefined') {
            bottleLottie = lottie.loadAnimation({
              container: document.querySelector(`#LottieContainer`),
              name: 'Bottle Animation',
              renderer: 'svg',
              loop: false,
              autoplay: false,
              animationData: BottleJson,
            });

            bottleLottie.setSpeed(2);

            bottleLottie.onEnterFrame = (e) => {
              AutBottleAnim.refreshDirection();

              const curTime = Math.ceil(e.currentTime);

              AutBottleAnim.frame.current = curTime;
              if (
                curTime === AutBottleAnim.frame.target ||
                curTime <= 0 ||
                curTime >= 104
              ) {
                bottleLottie.pause();
                AutBottleAnim.playing = false;
              }
            };

            bottleLottie.addEventListener('data_ready', () => {});
            bottleLottie.addEventListener('DOMLoaded', () => {
              // RUN AFTER LOAD AFTER IMAGES ARE LOADED
              if (
                props &&
                props.afterLoad &&
                typeof props.afterLoad === 'function'
              ) {
                props.afterLoad();
              }
            });

            bottleLottie.addEventListener('loaded_images', () => {
              // BUG NOT FIRING ON SAFARI
            });
          }
        } else {
          // IF BOTTLE ANIMATION IS DISABLED
          // RUN AFTER LOAD REGARDLESS
          if (
            props &&
            props.afterLoad &&
            typeof props.afterLoad === 'function'
          ) {
            props.afterLoad();
          }

          document.getElementById('BgContent').classList.add('noAnimation');
        }
      });
    },
    // NOT REQUIRED
    setFromScroll: () => {
      if (typeof window !== undefined && !AutBottleAnim.disable) {
        const scrollPos =
          window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight =
          window.innerHeight ||
          document.documentElement.clientHeight ||
          document.getElementsByTagName('body')[0].clientHeight;

        const getCurrentFrame = Math.round((scrollPos / windowHeight) * 35) + 1;
        // CHANGE CURRENT FRAME & ADD PAUSE
        AutBottleAnim.playUntil(getCurrentFrame);
      }
    },
  };

  // INIT LOADER
  const AutLoader = new LoaderClass({
    parent: `#${MainID}`,
    default_delay: 0,
    postload: () => {
      if (typeof window !== undefined) {
        window.scrollTo(0, 0);
        AutScrollSnap = new ScrollSnapClass({
          sections_identifier: `main#${MainID} section`,
          snap_identifier: '',
          speed: 500,
          maxduration: 1000,
          responsive_width: 800,
          responsive_height: 500,
          hasfooter: false,
          forceDisable: true,
        });
        // TRIGGER SCROLL SNAP INIT AND PAUSE
        AutScrollSnap.init();
        // AutScrollSnap.snap.to(1);
        AutScrollSnap.pause();
        document.body.classList.add('loaded');

        // Set Snap Navigation
        SnapNav = document.querySelectorAll(`main#${MainID} #AutSnapNav > *`);
        const setNav = (i) => {
          SnapNav.forEach((nav) => {
            nav.classList.remove('active');
          });
          if (i >= 0) {
            SnapNav[i].classList.add('active');
          }
        };

        setNav(0);

        //SETUP CLICK NAV
        SnapNav.forEach((nav, index) => {
          nav.onclick = () => {
            AutScrollSnap.snap.to(index);
          };
        });

        // SET DELAY for REVEAL ANIMATION IF NEEDED
        if (LoadAnimationTimeout !== null) clearTimeout(LoadAnimationTimeout);
        LoadAnimationTimeout = setTimeout(() => {
          //ENABLE SCROLL
          if (disableScrollBody !== null) disableScrollBody.enable();
          AutScrollSnap.play();

          document.body.classList.add('revealed');

          if (LoadAnimationTimeout !== null) clearTimeout(LoadAnimationTimeout);
        }, LoadAnimationDelay);

        const InfoRevealTreshold = 55;

        const convertFrom = ({ start = 1, range = 100, value = 1 }) => {
          return Math.round(range * value + start);
        };

        // INVIEW INIT
        AutInviewArray[0] = new InViewportClass({
          target: '.sectionwrapper > section:nth-child(1)',
          visibility: 0.55,
          enter: () => {
            if (autDataQuery)
              AutTitle.set(
                LangID ? autDataQuery.section1.id : autDataQuery.section1.en
              );
            setNav(0);
          },
          always: (e) => {
            const fromBtm = Math.round(e.visibleCoor.bottom * 10000) / 100;
            const fromTop = Math.round(e.visibleCoor.top * 10000) / 100;

            const infoContainer = document.querySelector('#info1');
            const findSmallest = Math.min(fromTop, fromBtm);
            if (findSmallest > InfoRevealTreshold) {
              infoContainer.classList.add('reveal');
            } else {
              infoContainer.classList.remove('reveal');
            }
            if (AutBottleAnim.disable) {
              // DISABLED, OPACITY TRANSITION
              let opacityTrans = transformValue({
                start: 20,
                end: 60,
                value: fromTop,
              });

              gsap.to(`#BottleFront`, { opacity: opacityTrans, duration: 0.1 });
            }
          },
        });

        AutInviewArray[1] = new InViewportClass({
          target: '.sectionwrapper > section:nth-child(2)',
          visibility: 0.55,
          enter: () => {
            if (autDataQuery)
              AutTitle.set(
                LangID ? autDataQuery.section2.id : autDataQuery.section2.en
              );
            setNav(1);
          },
          always: (e) => {
            const fromBtm = Math.round(e.visibleCoor.bottom * 10000) / 100;
            const fromTop = Math.round(e.visibleCoor.top * 10000) / 100;

            const infoContainer = document.querySelector('#info2');
            const findSmallest = Math.min(fromTop, fromBtm);

            if (findSmallest > InfoRevealTreshold) {
              infoContainer.classList.add('reveal');
            } else {
              infoContainer.classList.remove('reveal');
            }

            if (AutBottleAnim.disable) {
              // DISABLED, OPACITY TRANSITION
              // DEFAULT EXIT
              let opacityTrans = transformValue({
                start: 20,
                end: 60,
                value: fromTop,
              });

              if (fromBtm < 100) {
                // ENTER
                opacityTrans = transformValue({
                  start: 60,
                  end: 85,
                  value: fromBtm,
                });
              }

              gsap.to(`#BottleSide`, { opacity: opacityTrans, duration: 0.1 });
            } else {
              // NOT DISABLED
              // 1 to 35
              // BOTTLE ANIMATION
              if (fromBtm > 0 && fromBtm < 100) {
                AutBottleAnim.step(
                  convertFrom({ start: 1, range: 35, value: fromBtm / 100 })
                );
              }
            }
          },
          exit: () => {},
        });

        AutInviewArray[2] = new InViewportClass({
          target: '.sectionwrapper > section:nth-child(3)',
          visibility: 0.55,
          enter: () => {
            if (autDataQuery)
              AutTitle.set(
                LangID ? autDataQuery.section3.id : autDataQuery.section3.en
              );
            setNav(2);
          },
          always: (e) => {
            const fromTop = Math.round(e.visibleCoor.top * 10000) / 100;
            const fromBtm = Math.round(e.visibleCoor.bottom * 10000) / 100;

            let opacityTrans = transformValue({
              start: 15,
              end: 70,
              value: fromTop,
            });

            gsap.to(`#LottieContainer`, {
              opacity: opacityTrans,
              duration: 0.1,
            });

            const infoContainer = document.querySelector('#info3');
            const findSmallest = Math.min(fromTop, fromBtm);
            if (findSmallest > InfoRevealTreshold) {
              infoContainer.classList.add('reveal');
            } else {
              infoContainer.classList.remove('reveal');
            }

            if (AutBottleAnim.disable) {
              // DISABLED, OPACITY TRANSITION
              // DEFAULT EXIT
              let opacityTransFb = transformValue({
                start: 20,
                end: 60,
                value: fromTop,
              });
              if (fromBtm < 100) {
                // ENTER
                opacityTransFb = transformValue({
                  start: 70,
                  end: 100,
                  value: fromBtm,
                });
              }
              gsap.to(`#BottleBack`, {
                opacity: opacityTransFb,
                duration: 0.1,
              });
            } else {
              // NOT DISABLED
              // BOTTLE ANIMATION
              // 36 to 70
              if (fromBtm > 0 && fromBtm < 100) {
                AutBottleAnim.step(
                  convertFrom({ start: 36, range: 35, value: fromBtm / 100 })
                );
              }
            }
          },
          exit: () => {},
        });
        AutInviewArray[3] = new InViewportClass({
          target: '.sectionwrapper > section:nth-child(4)',
          visibility: 0.55,
          enter: () => {
            if (autDataQuery)
              AutTitle.set(
                LangID ? autDataQuery.section4.id : autDataQuery.section4.en
              );
            setNav(3);
          },
          always: (e) => {
            const fromBtm = Math.round(e.visibleCoor.bottom * 10000) / 100;
            const fromTop = Math.round(e.visibleCoor.top * 10000) / 100;

            // DEFAULT EXIT
            let opacityTrans = transformValue({
              start: 20,
              end: 60,
              value: fromTop,
            });

            if (fromBtm < 100) {
              // ENTER
              opacityTrans = transformValue({
                start: 70,
                end: 100,
                value: fromBtm,
              });
            }

            gsap.to(`#SealImage`, { opacity: opacityTrans, duration: 0.1 });

            const infoContainer = document.querySelector('#info4');
            const findSmallest = Math.min(fromTop, fromBtm);
            if (findSmallest > InfoRevealTreshold) {
              infoContainer.classList.add('reveal');
            } else {
              infoContainer.classList.remove('reveal');
            }

            // BOTTLE ANIMATION
            // 71 to 105
            if (fromBtm > 0 && fromBtm < 100) {
              AutBottleAnim.step(
                convertFrom({ start: 71, range: 35, value: fromBtm / 100 })
              );
            }
          },
          exit: () => {},
        });

        AutInviewArray[4] = new InViewportClass({
          target: '.sectionwrapper > section:nth-child(5)',
          visibility: 0.55,
          enter: () => {
            if (autDataQuery)
              AutTitle.set(
                LangID ? autDataQuery.section5.id : autDataQuery.section5.en
              );
            setNav(4);
          },
          always: (e) => {
            const fromBtm = Math.round(e.visibleCoor.bottom * 10000) / 100;

            let opacityTrans = transformValue({
              start: 70,
              end: 100,
              value: fromBtm,
            });

            gsap.to(`#CapsuleImage`, { opacity: opacityTrans, duration: 0.1 });
            const infoContainer = document.querySelector('#info5');
            if (fromBtm > InfoRevealTreshold + 10) {
              infoContainer.classList.add('reveal');
            } else {
              infoContainer.classList.remove('reveal');
            }
          },
          exit: () => {},
        });

        AutInviewArray[5] = new InViewportClass({
          target: 'section.footer',
          visibility: 0.05,
          enter: () => {
            document.querySelector('div.overlay').classList.add('stuck');
            setNav(-1);
          },
          exit: () => {
            document.querySelector('div.overlay').classList.remove('stuck');
            setNav(SnapNav.length - 1);
          },
        });
      }
    },
  });

  useLayoutEffect(() => {
    if (typeof document !== `undefined`) {
      document.body.classList.remove('loaded');
      AutLoader.renderload();
    }
  }, []);

  useEffect(() => {
    if (typeof document !== `undefined`) {
      window.scrollTo(0, 0);
      if (LangID) {
        document.querySelector('html').setAttribute('lang', 'id');
      } else {
        document.querySelector('html').setAttribute('lang', 'en');
      }
      disableScrollBody = new DisableScroll();
      window.addEventListener('resize', AutResize.run, false);
      AutResize.run();
    }
    // INIT BOTTLE ANIMATION
    AutBottleAnim.init({
      afterLoad: () => {
        AutLoader.mountload();
      },
    });

    AutTitle.init();

    return () => {
      if (typeof document !== `undefined`) {
        // REMOVE EVENTS
        window.removeEventListener('resize', AutResize.run, false);
      }
      if (AutScrollSnap) AutScrollSnap.kill();

      AutInviewArray.forEach((each, index) => {
        if (
          AutInviewArray[index] !== null &&
          AutInviewArray[index] !== undefined
        ) {
          AutInviewArray[index].kill();
          AutInviewArray[index] = null;
        }
      });
      if (bottleLottie !== null) bottleLottie.destroy();

      if (disableScrollBody !== null) {
        disableScrollBody.enable();
        disableScrollBody = null;
      }
      if (AutResize.timeout !== null) clearTimeout(AutResize.timeout);
      if (AutTitle.timeout !== null) clearTimeout(AutTitle.timeout);
    };
  }, []);
  return (
    <StaticQuery
      query={autQuery}
      render={(data) => {
        autDataQuery = data.general.frontmatter.auttranslation;

        const authenticationtitle =
          data.general.frontmatter.navigation.authentication;

        return (
          <Layout
            titleText={LangID ? authenticationtitle.id : authenticationtitle.en}
            mainClass='authentication'
            indonesia={LangID}
            mainID={MainID}
          >
            <PageHeader
              indonesia={LangID}
              urltarget={'/authentication'}
              urltargetid={'/id/autentikasi'}
              journal={false}
              headertitle={authenticationtitle}
              hidetitle={true}
              alwaystransparent={true}
            />
            <div className='sectionwrapper'>
              <section>
                <div>
                  <div>
                    {LangID
                      ? autDataQuery.section1info.info1.id
                      : autDataQuery.section1info.info1.en}
                  </div>
                  <div className='jamu'>
                    <span>
                      {LangID
                        ? autDataQuery.section1info.info2.id
                        : autDataQuery.section1info.info2.en}
                    </span>
                    <picture>
                      <source srcSet={JamuImgWebp} type='image/webp' />
                      <source srcSet={JamuImg} type='image/png' />
                      <img src={JamuImg} alt='Herbamojo' />
                    </picture>
                  </div>
                  <div>
                    {LangID
                      ? autDataQuery.section1info.info3.id
                      : autDataQuery.section1info.info3.en}
                  </div>
                  <div>
                    {LangID
                      ? autDataQuery.section1info.info4.id
                      : autDataQuery.section1info.info4.en}
                  </div>
                </div>
              </section>
              <section>
                <div>
                  <div>
                    {LangID
                      ? autDataQuery.section2info.info1.id
                      : autDataQuery.section2info.info1.en}
                  </div>
                  <div>
                    {LangID
                      ? autDataQuery.section2info.info2.id
                      : autDataQuery.section2info.info2.en}
                  </div>
                  <div>
                    {LangID
                      ? autDataQuery.section2info.info3.id
                      : autDataQuery.section2info.info3.en}
                  </div>
                </div>
              </section>
              <section>
                <div>
                  <div>
                    {LangID
                      ? autDataQuery.section3info.info1.id
                      : autDataQuery.section3info.info1.en}
                  </div>
                  <div>
                    {LangID
                      ? autDataQuery.section3info.info2.id
                      : autDataQuery.section3info.info2.en}
                  </div>
                </div>
              </section>
              <section>
                <div>
                  <div>
                    {LangID
                      ? autDataQuery.section4info.info1.id
                      : autDataQuery.section4info.info1.en}
                  </div>
                </div>
              </section>
              <section>
                <div>
                  <div>
                    {LangID
                      ? autDataQuery.section5info.info1.id
                      : autDataQuery.section5info.info1.en}
                  </div>
                </div>
              </section>
              <div className='overlay'>
                <div id='PageHeading' className={`${LangID ? 'indo' : ''}`}>
                  <span id='AutTitle'>
                    <span>{AutTitleState}</span>
                  </span>
                  <span className='aut'>
                    {LangID
                      ? authenticationtitle.id.toUpperCase()
                      : authenticationtitle.en.toUpperCase()}
                  </span>
                </div>
                <div id='AutSnapNav' className='snap_nav'>
                  <span className='active'>
                    <span>1</span>
                  </span>
                  <span>
                    <span>2</span>
                  </span>
                  <span>
                    <span>3</span>
                  </span>
                  <span>
                    <span>4</span>
                  </span>
                  <span>
                    <span>5</span>
                  </span>
                </div>
              </div>
            </div>
            <Footer indonesia={LangID} />
            <div id='BgContent' className=''>
              <div id='InfoContainer' className='centerObject'>
                <div id='info1'>
                  <div className='content_info'>
                    <div>
                      {LangID
                        ? autDataQuery.section1info.info1.id
                        : autDataQuery.section1info.info1.en}
                    </div>
                    <div></div>
                  </div>
                  <div className='content_info'>
                    <div>
                      <div>
                        {LangID
                          ? autDataQuery.section1info.info2.id
                          : autDataQuery.section1info.info2.en}
                      </div>
                      <picture>
                        <source srcSet={JamuImgWebp} type='image/webp' />
                        <source srcSet={JamuImg} type='image/png' />
                        <img src={JamuImg} alt='Herbamojo' />
                      </picture>
                    </div>
                    <div></div>
                  </div>
                  <div className='content_info flip'>
                    <div>
                      {LangID
                        ? autDataQuery.section1info.info3.id
                        : autDataQuery.section1info.info3.en}
                    </div>
                    <div></div>
                  </div>
                  <div className='content_info flip'>
                    <div>
                      {LangID
                        ? autDataQuery.section1info.info4.id
                        : autDataQuery.section1info.info4.en}
                    </div>
                    <div></div>
                  </div>
                </div>
                <div id='info2'>
                  <div className='content_info'>
                    <div>
                      {LangID
                        ? autDataQuery.section2info.info1.id
                        : autDataQuery.section2info.info1.en}
                    </div>
                    <div></div>
                  </div>
                  <div className='content_info flip'>
                    <div>
                      {LangID
                        ? autDataQuery.section2info.info2.id
                        : autDataQuery.section2info.info2.en}
                    </div>
                    <div></div>
                  </div>
                  <div className='content_info'>
                    <div>
                      {LangID
                        ? autDataQuery.section2info.info3.id
                        : autDataQuery.section2info.info3.en}
                    </div>
                    <div></div>
                  </div>
                </div>
                <div id='info3'>
                  <div className='content_info flip'>
                    <div>
                      {LangID
                        ? autDataQuery.section3info.info1.id
                        : autDataQuery.section3info.info1.en}
                    </div>
                    <div></div>
                  </div>
                  <div className='content_info'>
                    <div>
                      {LangID
                        ? autDataQuery.section3info.info2.id
                        : autDataQuery.section3info.info2.en}
                    </div>
                    <div></div>
                  </div>
                </div>
                <div id='info4'>
                  <div className='content_info flip'>
                    <div>
                      {LangID
                        ? autDataQuery.section4info.info1.id
                        : autDataQuery.section4info.info1.en}
                    </div>
                    <div></div>
                  </div>
                </div>
                <div id='info5'>
                  <div className='content_info'>
                    <div>
                      {LangID
                        ? autDataQuery.section5info.info1.id
                        : autDataQuery.section5info.info1.en}
                    </div>
                    <div></div>
                  </div>
                </div>
              </div>
              <div id='CapsuleImage' className='centerObject'>
                <picture>
                  <source srcSet={CapsuleImgWebp} type='image/webp' />
                  <source srcSet={CapsuleImg} type='image/png' />
                  <img src={CapsuleImg} alt='Herbamojo' />
                </picture>
              </div>
              <div id='SealImage' className='centerObject'>
                <picture>
                  <source srcSet={SealImgWebp} type='image/webp' />
                  <source srcSet={SealImg} type='image/png' />
                  <img src={SealImg} alt='Herbamojo' />
                </picture>
              </div>
              <div id='BottleFront' className='centerObject bottleFallback'>
                <picture>
                  <source srcSet={BottleFrontImgWebp} type='image/webp' />
                  <source srcSet={BottleFrontImg} type='image/jpg' />
                  <img src={BottleFrontImg} alt='Herbamojo' />
                </picture>
              </div>
              <div id='BottleSide' className='centerObject bottleFallback'>
                <picture>
                  <source srcSet={BottleSideImgWebp} type='image/webp' />
                  <source srcSet={BottleSideImg} type='image/jpg' />
                  <img src={BottleSideImg} alt='Herbamojo' />
                </picture>
              </div>
              <div id='BottleBack' className='centerObject bottleFallback'>
                <picture>
                  <source srcSet={BottleBackImgWebp} type='image/webp' />
                  <source srcSet={BottleBackImg} type='image/jpg' />
                  <img src={BottleBackImg} alt='Herbamojo' />
                </picture>
              </div>
              <div id='LottieContainer' className='centerObject'></div>
            </div>
          </Layout>
        );
      }}
    />
  );
}

const autQuery = graphql`
  query {
    general: markdownRemark(
      frontmatter: {
        issetting: { eq: true }
        contenttype: { eq: "general_setting" }
      }
    ) {
      frontmatter {
        navigation {
          authentication {
            en
            id
          }
        }
        auttranslation {
          section1 {
            en
            id
          }
          section2 {
            en
            id
          }
          section3 {
            en
            id
          }
          section4 {
            en
            id
          }
          section5 {
            en
            id
          }
          section1info {
            info1 {
              en
              id
            }
            info2 {
              en
              id
            }
            info3 {
              en
              id
            }
            info4 {
              en
              id
            }
          }
          section2info {
            info1 {
              en
              id
            }
            info2 {
              en
              id
            }
            info3 {
              en
              id
            }
          }
          section3info {
            info1 {
              en
              id
            }
            info2 {
              en
              id
            }
          }
          section4info {
            info1 {
              en
              id
            }
          }
          section5info {
            info1 {
              en
              id
            }
          }
        }
      }
    }
  }
`;
