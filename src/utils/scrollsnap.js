export const ScrollSnap = {
    v: {
        lastpos: 0,
        xDown: null,
        yDown: null,
        hasFooter: false,
        responsiveWidth: {
            treshold: 0,
            enable: true,
        },
        sections: {
            identifier: '',
            all: null,
            length: 0,
            current: 0,
            targets: null,
        },
        snap: {
            enable: true,
            pause: false,
            treshold: 400,
        },
        nav: {
            identifier: '',
            scrollingicon: '',
            childIdentifier: '> *',
            children: null,
            current: 0,
            hideonfooter: true,
            hideoncover: false,
            customnav: false,
            activeClass: 'active',
        },
        scroll: {
            snapping: false,
            initdelay: 0,
            direction: true,
            speed: 500,
            delay: 400,
            sensitivity: 10,
            minduration: 300,
            maxduration: 1500,
        },
        listener: {
            init: false,
            inittriggered: false,
        }
    },
    common: {
        windowHeight: () => {
            return window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight
        },
        windowWidth: () => {
            return window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth
        },
        scrollPosition: () => {
            return window.pageYOffset || document.documentElement.scrollTop
        },
    },
    scrollEvent: {
        before: () => {},
        after: () => {},
    },
    init: (obj) => {
        ScrollSnap.kill();
        ScrollSnap.v.sections.identifier = obj.sections_identifier || 'section.snap';
        ScrollSnap.v.scroll.delay = obj.delay || 200;
        ScrollSnap.v.scroll.initdelay = obj.init_delay || 500;
        ScrollSnap.v.scroll.sensitivity = obj.sensitivity || 10;
        ScrollSnap.v.scroll.speed = obj.speed || 500;
        ScrollSnap.v.scroll.minduration = obj.minimum_speed || 300;
        ScrollSnap.v.scroll.maxduration = obj.maxduration || 1500;

        ScrollSnap.v.hasfooter = obj.hasfooter !== undefined ? obj.hasfooter : true;
        ScrollSnap.v.nav.hideoncover = obj.hide_nav_oncover !== undefined ? obj.hide_nav_oncover : false;
        ScrollSnap.v.nav.hideonfooter = obj.hide_nav_onfooter !== undefined ? obj.hide_nav_onfooter : true;
        ScrollSnap.v.responsiveWidth.treshold = obj.responsive_width || 0;
        ScrollSnap.v.nav.identifier = obj.snap_identifier !== undefined ? obj.snap_identifier : '';
        ScrollSnap.v.nav.childClass = obj.snap_child_identifier !== undefined ? obj.snap_child_identifier : '> *';
        ScrollSnap.v.nav.activeClass = obj.snap_active_class || 'active';

        ScrollSnap.v.sections.all = document.querySelectorAll(ScrollSnap.v.sections.identifier);

        if (obj.afterScrollEvent && typeof obj.afterScrollEvent === 'function') {
            ScrollSnap.scrollEvent.after = obj.afterScrollEvent;
        }

        if (obj.beforeScrollEvent && typeof obj.beforeScrollEvent === 'function') {
            ScrollSnap.scrollEvent.before = obj.beforeScrollEvent;
        }

        ScrollSnap.v.sections.current = 0;

        ScrollSnap.snap.setup();

        //EVENT LISTENER
        ScrollSnap.event.init();
    },
    kill: () => {
        ScrollSnap.pause();
        ScrollSnap.v.snap.enable = false;
        ScrollSnap.event.remove();
        document.body.classList.remove('snapon');
    },
    pause: () => {
        ScrollSnap.v.snap.pause = true;
    },
    play: () => {
        ScrollSnap.v.snap.pause = false;
        ScrollSnap.snap.setup();
    },
    snap: {
        setup: () => {
            let checkheight = false;
            ScrollSnap.v.snap.pause = false;
            ScrollSnap.v.snap.enable = true;

            ScrollSnap.v.sections.all = document.querySelectorAll(ScrollSnap.v.sections.identifier);

            //CHECK ALL SECTIONS AND DISABLE SNAP IF ANY OF THE SECTIONS HAS HEIGHT BIGGER THAN THE WINDOW
            let navAtrCheck = true;
            ScrollSnap.v.sections.all.forEach((each) => {
                // 
                if (each.clientHeight > ScrollSnap.common.windowHeight()) {
                    checkheight = true;
                }

                //CHECK CUSTOM NAV POSITIONING
                if (each.getAttribute('nav') != null) {
                    const intCheck = Number(each.getAttribute('nav'));
                    if (typeof intCheck !== 'number') navAtrCheck = false;
                } else {
                    navAtrCheck = false;
                }
            });

            if (checkheight) {
                ScrollSnap.v.snap.enable = false;

            }

            if (navAtrCheck) {
                ScrollSnap.v.nav.customnav = true;
            }

            //PUSH LENGTH TO GLOBAL VARIABLE
            ScrollSnap.v.sections.length = ScrollSnap.v.sections.all.length;

            //SETUP SCROLL POSITIONING FOR EACH SECTION
            ScrollSnap.snap.setuptargets();

            // ------
            //SNAP NAVIGATION SETUP
            //CHECK WHERE TO GO and NAVIGATION
            //CLICK TRIGGER NAV TO GO TO THE SET SECTION

            //SETUP CUSTOM NAV TRIGGER
            let navtarget = [];

            if (ScrollSnap.v.nav.customnav) {
                //PENDING
            }

            //SET TRIGGER
            if (ScrollSnap.v.nav.identifier !== '') {
                ScrollSnap.v.nav.children = document.querySelectorAll(`${ScrollSnap.v.nav.identifier} ${ScrollSnap.v.nav.childIdentifier}`);

                ScrollSnap.v.nav.children.forEach((child, index) => {
                    child.onclick = null;
                    child.onclick = () => {
                        if (ScrollSnap.v.snap.enable && !ScrollSnap.v.snap.pause) {
                            if (!ScrollSnap.v.nav.customnav) {
                                ScrollSnap.snap.to(index);
                            } else {
                                ScrollSnap.snap.to(navtarget[index]);
                            }
                        }
                    };
                })
            }

            //CHECK WIDTH AND DISABLE SNAP IF WIDTH IS LESS THAN THE TRESHOLD SET
            // 

            if (ScrollSnap.common.windowWidth() < ScrollSnap.v.responsiveWidth.treshold) {
                ScrollSnap.v.snap.enable = false;

            }

            if (ScrollSnap.v.snap.enable) {
                //CHECK CURRENT POSITION AND ADJUST
                let checkcur = Math.floor(ScrollSnap.common.scrollPosition() / ScrollSnap.common.windowHeight());
                // 
                if (checkcur >= ScrollSnap.v.sections.length) {
                    ScrollSnap.v.sections.current = ScrollSnap.v.sections.length - 1;
                } else {
                    ScrollSnap.v.sections.current = checkcur;
                }
                ScrollSnap.snap.scrolling();
                // TURN ON CLASS
                document.body.classList.add('snapon');
            } else {
                // TURN OFF CLASS
                document.body.classList.remove('snapon');
            }

            // 

            // 
        },

        setuptargets: () => {
            ScrollSnap.v.sections.targets = [];

            ScrollSnap.v.sections.all.forEach((each, index) => {
                let scrollPos;
                if (index !== 0) {
                    scrollPos = ScrollSnap.v.sections.targets[index - 1] + each.offsetHeight;
                } else {
                    scrollPos = each.offsetHeight - ScrollSnap.common.windowHeight();
                }
                ScrollSnap.v.sections.targets.push(scrollPos);

                if (ScrollSnap.v.hasfooter && ((index + 1) === ScrollSnap.v.sections.length)) {
                    let footeroffset = each.offsetHeight - ScrollSnap.common.windowHeight();
                    ScrollSnap.v.sections.targets.push(ScrollSnap.v.sections.targets[index] + footeroffset);
                }
            });
            // 
        },

        down: () => {
            if (ScrollSnap.v.snap.enable && !ScrollSnap.v.scroll.snapping && !ScrollSnap.scrollit.scrolling && !ScrollSnap.v.snap.pause) {
                // 
                // 
                ScrollSnap.v.sections.current++;
                if (ScrollSnap.v.sections.current > ScrollSnap.v.sections.length - 1) {
                    ScrollSnap.v.sections.current = ScrollSnap.v.sections.length - 1;
                } else {
                    ScrollSnap.snap.scrolling();
                }
            }
        },
        to: (target) => {
            if (!ScrollSnap.v.scroll.snapping && !ScrollSnap.scrollit.scrolling && !ScrollSnap.v.snap.pause) {
                if (ScrollSnap.v.sections.current !== target) {
                    ScrollSnap.v.sections.current = target;
                    ScrollSnap.snap.scrolling();
                }
            }
        },
        up: () => {
            if (ScrollSnap.v.snap.enable && !ScrollSnap.v.scroll.snapping && !ScrollSnap.scrollit.scrolling && !ScrollSnap.v.snap.pause) {
                // 
                ScrollSnap.v.sections.current--;
                if (ScrollSnap.v.sections.current < 0) {
                    ScrollSnap.v.sections.current = 0;
                } else {
                    ScrollSnap.snap.scrolling();
                }
            }
        },
        scrolling: () => {
            if (!ScrollSnap.v.scroll.snapping && !ScrollSnap.scrollit.scrolling && !ScrollSnap.v.snap.pause) {
                ScrollSnap.v.scroll.snapping = true;

                // ADJUST NAVIGATION
                if (ScrollSnap.v.snap.enable && !ScrollSnap.v.snap.pause && ScrollSnap.v.nav.identifier !== '') {
                    if (ScrollSnap.v.hasfooter && ScrollSnap.v.sections.current === ScrollSnap.v.sections.length) {
                        ScrollSnap.nav.set(-1);
                    } else {
                        if (ScrollSnap.nav.customnav) {
                            // GO TO NAVIGATION SET ON THE NAV VALUE
                            //PENDING
                            if (ScrollSnap.v.sections.all[ScrollSnap.v.sections.current].getAttribute('nav') != null) {
                                ScrollSnap.nav.set(ScrollSnap.v.sections.all[ScrollSnap.v.sections.current].getAttribute('nav'));
                            }
                        } else {
                            ScrollSnap.nav.set(ScrollSnap.v.sections.current);
                        }
                    }
                }

                const topval = ScrollSnap.common.windowHeight() * ScrollSnap.v.sections.current;

                const dist = Math.abs(topval - ScrollSnap.common.scrollPosition());
                let duration = dist / ScrollSnap.common.windowHeight() * ScrollSnap.v.scroll.speed;
                if (duration < ScrollSnap.v.scroll.minduration) duration = ScrollSnap.v.scroll.minduration;
                if (duration > ScrollSnap.v.scroll.maxduration) duration = ScrollSnap.v.scroll.maxduration;

                ScrollSnap.scrollEvent.before();
                ScrollSnap.scrollit.go(topval, duration);

                setTimeout(() => {
                    ScrollSnap.v.scroll.snapping = false;
                }, (duration + ScrollSnap.v.scroll.delay));
            }
        },
    },
    event: {
        init: () => {
            if (!ScrollSnap.v.listener.init) {
                if (ScrollSnap.v.listener.inittriggered) ScrollSnap.event.remove();

                ScrollSnap.v.listener.inittriggered = true;
                ScrollSnap.v.listener.init = true;

                if (window.addEventListener) {
                    window.addEventListener('DOMMouseScroll', ScrollSnap.event.scroll, false);
                    window.addEventListener('wheel', ScrollSnap.event.scroll, {
                        passive: false
                    });
                    window.addEventListener('mousewheel', ScrollSnap.event.scroll, {
                        passive: false
                    });
                    window.addEventListener('keydown', ScrollSnap.event.keydown, false);
                }

                if ('ontouchstart' in document.documentElement) {
                    document.addEventListener('touchstart', ScrollSnap.event.touchstart, false);
                    document.addEventListener('touchmove', ScrollSnap.event.touchmove, false);
                }

                window.addEventListener('resize', ScrollSnap.event.resize);

                ScrollSnap.v.snap.pause = false;
            }
        },
        remove: () => {
            if (ScrollSnap.v.listener.init) {
                if (window.addEventListener) {
                    window.removeEventListener('DOMMouseScroll', ScrollSnap.event.scroll, false);
                    window.removeEventListener('wheel', ScrollSnap.event.scroll, {
                        passive: false
                    });
                    window.removeEventListener('mousewheel', ScrollSnap.event.scroll, {
                        passive: false
                    });
                    window.removeEventListener('keydown', ScrollSnap.event.keydown, false);
                }

                if ('ontouchstart' in document.documentElement) {
                    document.removeEventListener('touchstart', ScrollSnap.event.touchstart, false);
                    document.removeEventListener('touchmove', ScrollSnap.event.touchmove, false);
                }
                window.removeEventListener('resize', ScrollSnap.event.resize);
                ScrollSnap.v.listener.init = false;
            }
        },
        resizeTimeout: null,
        resizePause: false,
        resize: () => {
            ScrollSnap.event.resizePause = true;
            if (ScrollSnap.event.resizeTimeout != null) {
                clearTimeout(ScrollSnap.event.resizeTimeout);
            }
            //SET DELAY AND DISABLE SCROLL ONLY AFTER THE RESIZE EVENT IS RESOLVE
            ScrollSnap.event.resizeTimeout = setTimeout(() => {

                ScrollSnap.event.resizePause = false;
                ScrollSnap.snap.setup();
            }, 250);
        },
        scroll: (e) => {

            if (ScrollSnap.v.snap.enable) {
                e = e || window.event;
                if (e.preventDefault) e.preventDefault();
                e.returnValue = false;
                if (e.deltaY < -ScrollSnap.v.scroll.sensitivity) {
                    if (!ScrollSnap.v.snap.pause && !ScrollSnap.event.resizePause) ScrollSnap.snap.up();
                }
                if (e.deltaY > ScrollSnap.v.scroll.sensitivity) {
                    if (!ScrollSnap.v.snap.pause && !ScrollSnap.event.resizePause) ScrollSnap.snap.down();
                }
            }
        },
        keydown: (e) => {
            if (ScrollSnap.v.snap.enable) {
                if (e.which === 38 || e.which === 40 || e.which === 32) {
                    e = e || window.event;
                    if (e.preventDefault) e.preventDefault();
                    e.returnValue = false;
                }
                switch (e.which) {
                    case 38:
                        if (!ScrollSnap.v.snap.pause && !ScrollSnap.event.resizePause) ScrollSnap.snap.up();
                        break;

                    case 40:
                    case 32:
                        if (!ScrollSnap.v.snap.pause && !ScrollSnap.event.resizePause) ScrollSnap.snap.down();
                        break;
                    default:
                        break;
                }
            }
        },
        touchstart: (evt) => {
            if (ScrollSnap.v.snap.enable) {
                ScrollSnap.v.xDown = evt.touches[0].clientX;
                ScrollSnap.v.yDown = evt.touches[0].clientY;
            }
        },
        touchmove: (evt) => {
            if (ScrollSnap.v.snap.enable) {
                if (!ScrollSnap.v.xDown || !ScrollSnap.v.yDown) {
                    return;
                }

                let xUp = evt.touches[0].clientX;
                let yUp = evt.touches[0].clientY;

                let xDiff = ScrollSnap.v.xDown - xUp;
                let yDiff = ScrollSnap.v.yDown - yUp;

                if (!ScrollSnap.v.snap.pause && !ScrollSnap.event.resizePause) {
                    if (Math.abs(xDiff) > Math.abs(yDiff)) {
                        /*most significant*/
                        if (xDiff > 0) {} else {}
                    } else {
                        if (yDiff > 0) {
                            ScrollSnap.snap.down();
                        } else {
                            ScrollSnap.snap.up();
                        }
                    }
                }
                ScrollSnap.v.xDown = null;
                ScrollSnap.v.yDown = null;
            }
        },
    },
    nav: {
        // GO TO NAV
        set: (nav) => {
            if (ScrollSnap.v.nav.identifier !== '' && document.querySelector(ScrollSnap.v.nav.identifier)) {
                ScrollSnap.v.nav.current = nav;
                ScrollSnap.v.nav.children = document.querySelectorAll(`${ScrollSnap.v.nav.identifier} ${ScrollSnap.v.nav.childIdentifier}`);

                // 

                if (ScrollSnap.v.nav.children.length > 0) {
                    ScrollSnap.v.nav.children.forEach((each, index) => {
                        if (index === ScrollSnap.v.nav.current) {
                            each.classList.add(ScrollSnap.v.nav.activeClass);
                        } else {
                            each.classList.remove(ScrollSnap.v.nav.activeClass);
                        }
                    });

                    if (ScrollSnap.v.nav.hideoncover) {
                        if (nav === 0) {
                            document.querySelector(ScrollSnap.v.nav.identifier).classList.add('hide_nav');
                        } else {
                            document.querySelector(ScrollSnap.v.nav.identifier).classList.remove('hide_nav');
                        }
                    }

                    if (ScrollSnap.v.nav.hideonfooter) {
                        if (nav < 0) {
                            document.querySelector(ScrollSnap.v.nav.identifier).classList.add('hide_nav');
                        } else {
                            document.querySelector(ScrollSnap.v.nav.identifier).classList.remove('hide_nav');
                        }
                    }

                    if (ScrollSnap.v.nav.scrollingicon !== '') {
                        if (ScrollSnap.v.nav.current !== 0) {
                            document.querySelector(ScrollSnap.v.nav.scrollingicon).classList.add('hide_icon');
                        } else {
                            document.querySelector(ScrollSnap.v.nav.scrollingicon).classList.remove('hide_icon');
                        }
                    }
                }

            }
        },
    },
    scrollit: {
        scrolling: false,
        go: (destination, duration = 200, easing = 'easeInOutQuad', callback) => {
            const easings = {
                linear(t) {
                    return t;
                },
                easeInQuad(t) {
                    return t * t;
                },
                easeOutQuad(t) {
                    return t * (2 - t);
                },
                easeInOutQuad(t) {
                    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                },
                easeInCubic(t) {
                    return t * t * t;
                },
                easeOutCubic(t) {
                    return --t * t * t + 1;
                },
                easeInOutCubic(t) {
                    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
                },
                easeInQuart(t) {
                    return t * t * t * t;
                },
                easeOutQuart(t) {
                    return 1 - --t * t * t * t;
                },
                easeInOutQuart(t) {
                    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
                },
                easeInQuint(t) {
                    return t * t * t * t * t;
                },
                easeOutQuint(t) {
                    return 1 + --t * t * t * t * t;
                },
                easeInOutQuint(t) {
                    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
                }
            };

            ScrollSnap.scrollit.scrolling = true;

            const start = window.pageYOffset;
            const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

            const windowHeight =
                window.innerHeight ||
                document.documentElement.clientHeight ||
                document.getElementsByTagName('body')[0].clientHeight;

            const documentHeight = Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
            );

            const destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;

            const destinationOffsetToScroll = Math.round(
                documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset
            );

            if ('requestAnimationFrame' in window === false) {
                if (callback) {
                    callback();
                }
                return;
            }

            const scroll = () => {
                const now = 'now' in window.performance ? performance.now() : new Date().getTime();
                const time = Math.min(1, (now - startTime) / duration);
                const timeFunction = easings[easing](time);
                window.scroll(0, Math.ceil(timeFunction * (destinationOffsetToScroll - start) + start));

                if (window.pageYOffset === destinationOffsetToScroll) {
                    ScrollSnap.scrollit.scrolling = false;
                    window.scroll(0, destinationOffsetToScroll);
                    ScrollSnap.snap.scrolling();
                    ScrollSnap.scrollEvent.after();
                    if (callback) {
                        callback();
                    }
                    return;
                }

                requestAnimationFrame(scroll);
            };

            scroll();
        }
    }
};
