export class ScrollSnapClass {
    v = {
        lastpos: 0,
        xDown: null,
        yDown: null,
        hasFooter: false,
        responsiveWidth: {
            treshold: 0,
            enable: true,
        },
        responsiveHeight: {
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
            sensitivity: 20,
            minduration: 300,
            maxduration: 1500,
        },
        listener: {
            init: false,
            inittriggered: false,
        }
    }
    common = {
        windowHeight: () => {
            return window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight
        },
        windowWidth: () => {
            return window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth
        },
        scrollPosition: () => {
            return window.pageYOffset || document.documentElement.scrollTop
        },
    }
    scrollEvent = {
        before: () => {},
        after: () => {},
    }
    constructor(obj) {
        this.kill();

        this.v.snap.pause = false;
        this.v.snap.enable = true;
        this.v.sections.identifier = typeof obj.sections_identifier === 'string' ? obj.sections_identifier : 'section.snap';
        this.v.scroll.delay = obj.delay || 200;
        this.v.scroll.initdelay = obj.init_delay || 500;
        this.v.scroll.sensitivity = obj.sensitivity || 10;
        this.v.scroll.speed = obj.speed || 500;
        this.v.scroll.minduration = obj.minimum_speed || 300;
        this.v.scroll.maxduration = obj.maxduration || 1500;

        this.v.hasfooter = obj.hasfooter !== undefined ? obj.hasfooter : true;
        this.v.nav.hideoncover = obj.hide_nav_oncover !== undefined ? obj.hide_nav_oncover : false;
        this.v.nav.hideonfooter = obj.hide_nav_onfooter !== undefined ? obj.hide_nav_onfooter : true;
        this.v.responsiveWidth.treshold = obj.responsive_width || 0;
        this.v.responsiveHeight.treshold = obj.responsive_height || 0;
        this.v.nav.identifier = obj.snap_identifier !== undefined ? obj.snap_identifier : '';
        this.v.nav.childClass = obj.snap_child_identifier !== undefined ? obj.snap_child_identifier : '> *';
        this.v.nav.activeClass = obj.snap_active_class || 'active';
        if (typeof document !== `undefined`) {
            this.v.sections.all = document.querySelectorAll(this.v.sections.identifier);
        }

        if (obj.afterScrollEvent && typeof obj.afterScrollEvent === 'function') {
            this.scrollEvent.after = obj.afterScrollEvent;
        }

        if (obj.beforeScrollEvent && typeof obj.beforeScrollEvent === 'function') {
            this.scrollEvent.before = obj.beforeScrollEvent;
        }
        // this.init();
    }
    init() {
        this.kill();
        this.v.snap.pause = false;
        this.v.snap.enable = true;
        this.v.sections.current = 0;
        window.scroll(0, 0);
        this.snap.setup();
        //EVENT LISTENER
        this.event.init();
    }
    kill() {
        this.v.snap.enable = false;
        this.event.remove();
        if (typeof document !== `undefined`) document.body.classList.remove('snapon');
    }
    pause() {
        this.v.snap.pause = true;
    }
    play() {
        this.v.snap.pause = false;
        this.snap.setup();
    }
    reset() {
        this.kill();
        this.init();
    }
    snap = {
        setup: () => {
            this.v.snap.pause = false;
            this.v.snap.enable = true;

            document.body.classList.add('snapon');

            this.v.sections.all = document.querySelectorAll(this.v.sections.identifier);

            //CHECK ALL SECTIONS AND DISABLE SNAP IF ANY OF THE SECTIONS HAS HEIGHT BIGGER THAN THE WINDOW
            let checkheight = false;
            // CHECK IF THERE IS A NAV ATTR ON SECTION
            let navAtrCheck = true;
            this.v.sections.all.forEach((each) => {
                if (each.clientHeight > this.common.windowHeight() || this.common.windowHeight() < this.v.responsiveHeight.treshold) {
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
                this.v.snap.enable = false;
            }

            if (navAtrCheck) {
                this.v.nav.customnav = true;
            }

            //PUSH LENGTH TO GLOBAL VARIABLE
            this.v.sections.length = this.v.sections.all.length;

            //SETUP SCROLL POSITIONING FOR EACH SECTION
            this.snap.setuptargets();

            // ------
            //SNAP NAVIGATION SETUP
            //CHECK WHERE TO GO and NAVIGATION
            //CLICK TRIGGER NAV TO GO TO THE SET SECTION

            //SETUP CUSTOM NAV TRIGGER
            let navtarget = [];

            if (this.v.nav.customnav) {
                //PENDING
            }

            //SET TRIGGER
            if (this.v.nav.identifier !== '') {
                this.v.nav.children = document.querySelectorAll(`${this.v.nav.identifier} ${this.v.nav.childIdentifier}`);

                this.v.nav.children.forEach((child, index) => {
                    child.onclick = null;
                    child.onclick = () => {
                        if (this.v.snap.enable && !this.v.snap.pause) {
                            if (!this.v.nav.customnav) {
                                this.snap.to(index);
                            } else {
                                this.snap.to(navtarget[index]);
                            }
                        }
                    };
                })
            }

            //CHECK WIDTH AND DISABLE SNAP IF WIDTH IS LESS THAN THE TRESHOLD SET

            if (this.common.windowWidth() < this.v.responsiveWidth.treshold) {
                this.v.snap.enable = false;

            }
            if (this.v.snap.enable) {
                console.log('snap enable');
                //CHECK CURRENT POSITION AND ADJUST
                let checkcur = Math.floor(this.common.scrollPosition() / this.common.windowHeight());
                if (checkcur >= this.v.sections.length) {
                    this.v.sections.current = this.v.sections.length - 1;
                } else {
                    this.v.sections.current = checkcur;
                }
                this.snap.scrolling();
                // TURN ON CLASS
                document.body.classList.add('snapon');
            } else {
                // TURN OFF CLASS
                console.log('snap disable');
                document.body.classList.remove('snapon');
            }
        },

        setuptargets: () => {
            this.v.sections.targets = [];

            document.body.classList.add('snapon');

            this.v.sections.all.forEach((each, index) => {

                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                this.v.sections.targets.push((each.getBoundingClientRect().top + scrollTop));

                if (this.v.hasfooter && ((index + 1) === this.v.sections.length)) {
                    let footeroffset = each.offsetHeight - this.common.windowHeight();
                    this.v.sections.targets.push(this.v.sections.targets[index] + footeroffset);
                }
            });

            if (!this.v.snap.enable) document.body.classList.remove('snapon');
        },

        down: () => {
            // console.log('snap down', this.v.sections);
            if (this.v.snap.enable && !this.v.scroll.snapping && !this.scrollit.scrolling && !this.v.snap.pause) {
                this.v.sections.current++;
                if (this.v.sections.current > this.v.sections.length - 1) {
                    this.v.sections.current = this.v.sections.length - 1;
                } else {
                    this.snap.scrolling();
                }
            }
        },
        to: (target) => {
            if (!this.v.scroll.snapping && !this.scrollit.scrolling && !this.v.snap.pause) {
                if (this.v.sections.current !== target) {
                    this.v.sections.current = target;
                    this.snap.scrolling();
                }
            }
        },
        up: () => {
            // console.log('snap up', this.v.sections);
            if (this.v.snap.enable && !this.v.scroll.snapping && !this.scrollit.scrolling && !this.v.snap.pause) {
                this.v.sections.current--;
                if (this.v.sections.current < 0) {
                    this.v.sections.current = 0;
                } else {
                    this.snap.scrolling();
                }
            }
        },
        scrolling: () => {
            // console.log('scrolling trigger', this.v.snap);
            if (!this.v.scroll.snapping && !this.scrollit.scrolling && !this.v.snap.pause) {
                this.v.scroll.snapping = true;

                // ADJUST NAVIGATION
                if (this.v.snap.enable && !this.v.snap.pause && this.v.nav.identifier !== '') {
                    if (this.v.hasfooter && this.v.sections.current === this.v.sections.length) {
                        this.nav.set(-1);
                    } else {
                        if (this.nav.customnav) {
                            // GO TO NAVIGATION SET ON THE NAV VALUE
                            //PENDING
                            if (this.v.sections.all[this.v.sections.current].getAttribute('nav') != null) {
                                this.nav.set(this.v.sections.all[this.v.sections.current].getAttribute('nav'));
                            }
                        } else {
                            this.nav.set(this.v.sections.current);
                        }
                    }
                }

                const topval = this.common.windowHeight() * this.v.sections.current;

                const dist = Math.abs(topval - this.common.scrollPosition());
                let duration = dist / this.common.windowHeight() * this.v.scroll.speed;
                if (duration < this.v.scroll.minduration) duration = this.v.scroll.minduration;
                if (duration > this.v.scroll.maxduration) duration = this.v.scroll.maxduration;

                this.scrollEvent.before();
                this.scrollit.go(topval, duration);

                setTimeout(() => {
                    this.v.scroll.snapping = false;
                }, (duration + this.v.scroll.delay));
            }
        },
    }
    event = {
        init: () => {
            if (!this.v.listener.init) {
                if (this.v.listener.inittriggered) this.event.remove();

                this.v.listener.inittriggered = true;
                this.v.listener.init = true;
                if (window.addEventListener) {
                    console.log('event init');
                    window.addEventListener('DOMMouseScroll', this.event.scroll, {
                        pasive: false
                    });
                    window.addEventListener('wheel', this.event.scroll, {
                        passive: false
                    });
                    window.addEventListener('mousewheel', this.event.scroll, {
                        passive: false
                    });
                    window.addEventListener('keydown', this.event.keydown, false);
                }

                if ('ontouchstart' in document.documentElement) {
                    document.addEventListener('touchstart', this.event.touchstart, false);
                    document.addEventListener('touchmove', this.event.touchmove, false);
                }

                window.addEventListener('resize', this.event.resize);

                this.v.snap.pause = false;
            }
        },
        remove: () => {
            if (this.v.listener.init) {
                if (window.addEventListener) {
                    window.removeEventListener('DOMMouseScroll', this.event.scroll, {
                        pasive: false
                    });
                    window.removeEventListener('wheel', this.event.scroll, {
                        passive: false
                    });
                    window.removeEventListener('mousewheel', this.event.scroll, {
                        passive: false
                    });
                    window.removeEventListener('keydown', this.event.keydown, false);
                }

                if ('ontouchstart' in document.documentElement) {
                    document.removeEventListener('touchstart', this.event.touchstart, false);
                    document.removeEventListener('touchmove', this.event.touchmove, false);
                }
                window.removeEventListener('resize', this.event.resize);
                this.v.listener.init = false;
            }
        },
        resizeTimeout: null,
        resizePause: false,
        resize: () => {
            this.event.resizePause = true;
            if (this.event.resizeTimeout != null) {
                clearTimeout(this.event.resizeTimeout);
            }
            //SET DELAY AND DISABLE SCROLL ONLY AFTER THE RESIZE EVENT IS RESOLVE
            this.event.resizeTimeout = setTimeout(() => {

                this.event.resizePause = false;
                this.snap.setup();
            }, 250);
        },
        scrolling: false,
        scrollStatus: {
            direction: null,
            lastDeltaY: 0
        },
        scroll: (e) => {
            // console.log(e.deltaY);
            if (this.v.snap.enable) {
                e = e || window.event;
                if (e.preventDefault) e.preventDefault();
                e.returnValue = false;
                if (e.deltaY < -this.v.scroll.sensitivity) {
                    if (!this.event.scrolling) {
                        if (!this.v.snap.pause && !this.event.resizePause) this.snap.up();
                        this.event.scrolling = true;
                        this.event.scrollStatus.direction = 'UP';
                    }
                }
                if (e.deltaY > this.v.scroll.sensitivity) {
                    if (!this.event.scrolling) {
                        if (!this.v.snap.pause && !this.event.resizePause) this.snap.down();
                        this.event.scrolling = true;
                        this.event.scrollStatus.direction = 'DOWN';
                    }
                }

                // ADDED SCROLL BREAK, WHICH WILL STOP SNAPPING IF THE USER SCROLLED TOO HARD
                // THIS SCRIPT WILL DISABLE THE SCROLL WHEN SCROLL SNAP IS DETECTED
                // THEN IT WILL DETECT WHEN THE SCROLL SPEED WHEN DOWN OR WHEN THE OTHER DIRECTION, THEN IT WILL ENABLE IT

                const _l = this.event.scrollStatus.lastDeltaY;

                if (_l > e.deltaY) {
                    if (this.event.scrollStatus.direction === 'UP') {
                        this.event.scrolling = false;
                        this.event.scrollStatus.direction = 'DOWN';
                    } else {
                        this.event.scrollStatus.direction = 'DOWN';
                    }
                } else if (_l < e.deltaY) {
                    if (this.event.scrollStatus.direction === 'DOWN') {
                        this.event.scrolling = false;
                        this.event.scrollStatus.direction = 'UP';
                    } else {
                        this.event.scrollStatus.direction = 'UP';
                    }
                } else {
                    this.event.scrollStatus.direction = null;
                }

                this.event.scrollStatus.lastDeltaY = e.deltaY;
                // console.log(e.deltaY,  this.event.scrollStatus.direction );
                // console.log(e.deltaY, _l, this.event.scrollStatus.direction, this.event.scrolling );
            }
        },
        keydown: (e) => {
            if (this.v.snap.enable) {
                if (e.which === 38 || e.which === 40 || e.which === 32) {
                    e = e || window.event;
                    if (e.preventDefault) e.preventDefault();
                    e.returnValue = false;
                }
                switch (e.which) {
                    case 38:
                        if (!this.v.snap.pause && !this.event.resizePause) this.snap.up();
                        break;

                    case 40:
                    case 32:
                        if (!this.v.snap.pause && !this.event.resizePause) this.snap.down();
                        break;
                    default:
                        break;
                }
            }
        },
        touchstart: (evt) => {
            if (this.v.snap.enable) {
                this.v.xDown = evt.touches[0].clientX;
                this.v.yDown = evt.touches[0].clientY;
            }
        },
        touchmove: (evt) => {
            if (this.v.snap.enable) {
                if (!this.v.xDown || !this.v.yDown) {
                    return;
                }

                let xUp = evt.touches[0].clientX;
                let yUp = evt.touches[0].clientY;

                let xDiff = this.v.xDown - xUp;
                let yDiff = this.v.yDown - yUp;

                if (!this.v.snap.pause && !this.event.resizePause) {
                    if (Math.abs(xDiff) > Math.abs(yDiff)) {
                        /*most significant*/
                        if (xDiff > 0) {} else {}
                    } else {
                        if (yDiff > 0) {
                            this.snap.down();
                        } else {
                            this.snap.up();
                        }
                    }
                }
                this.v.xDown = null;
                this.v.yDown = null;
            }
        },
    }
    nav = {
        // GO TO NAV
        set: (nav) => {
            if (this.v.nav.identifier !== '' && document.querySelector(this.v.nav.identifier)) {
                this.v.nav.current = nav;
                this.v.nav.children = document.querySelectorAll(`${this.v.nav.identifier} ${this.v.nav.childIdentifier}`);

                // 

                if (this.v.nav.children.length > 0) {
                    this.v.nav.children.forEach((each, index) => {
                        if (index === this.v.nav.current) {
                            each.classList.add(this.v.nav.activeClass);
                        } else {
                            each.classList.remove(this.v.nav.activeClass);
                        }
                    });

                    if (this.v.nav.hideoncover) {
                        if (nav === 0) {
                            document.querySelector(this.v.nav.identifier).classList.add('hide_nav');
                        } else {
                            document.querySelector(this.v.nav.identifier).classList.remove('hide_nav');
                        }
                    }

                    if (this.v.nav.hideonfooter) {
                        if (nav < 0) {
                            document.querySelector(this.v.nav.identifier).classList.add('hide_nav');
                        } else {
                            document.querySelector(this.v.nav.identifier).classList.remove('hide_nav');
                        }
                    }

                    if (this.v.nav.scrollingicon !== '') {
                        if (this.v.nav.current !== 0) {
                            document.querySelector(this.v.nav.scrollingicon).classList.add('hide_icon');
                        } else {
                            document.querySelector(this.v.nav.scrollingicon).classList.remove('hide_icon');
                        }
                    }
                }

            }
        },
    }
    scrollit = {
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

            this.scrollit.scrolling = true;

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
                    this.scrollit.scrolling = false;
                    window.scroll(0, destinationOffsetToScroll);
                    this.snap.scrolling();
                    this.scrollEvent.after();
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

export const ScrollSnap = new ScrollSnapClass({
    sections_identifier: `section.snap`,
    speed: 500,
    maxduration: 1500,
    responsive_width: 650,
    responsive_height: 500
});
