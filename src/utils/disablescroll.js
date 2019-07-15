export class DisableScroll {
    scrolldisabled = false;
    target = null;
    constructor(obj) {
        if (obj) {
            if (obj.target !== undefined) this.target = obj.target || null;
            if (typeof this.target === 'string') {
                const targetelem = document.querySelector(this.target);
                this.target = targetelem;
            }
        }
        this.disable();
    }
    disable(){
        if (!this.scrolldisabled) {
            console.log('scroll disable');
            this.scrolldisabled = true;
            if (this.target === null) {
                if (typeof document !== `undefined`) {
                    document.body.classList.add('__disablescroll');
                }
                if (window.addEventListener) {
                    window.addEventListener('DOMMouseScroll', this.event.disable, false);
                    window.addEventListener('wheel', this.event.disable, {
                        passive: false
                    });
                    window.addEventListener('mousewheel', this.event.disable, {
                        passive: false
                    });
                    window.addEventListener('keydown', this.event.keydown, false);
                }
                if ('ontouchstart' in document.documentElement) {
                    window.addEventListener('touchstart', this.event.disableHard, false);
                    window.addEventListener('touchmove', this.event.disableHard, false);
                    document.body.addEventListener('touchstart', this.event.disableHard, false);
                    document.body.addEventListener('touchmove', this.event.disableHard, false);
                    document.addEventListener('touchstart', this.event.disableHard, false);
                    document.addEventListener('touchmove', this.event.disableHard, false);
                    document.documentElement.addEventListener('touchstart', this.event.disableHard, false);
                    document.documentElement.addEventListener('touchmove', this.event.disableHard, false);
                }
            } else {
                if (this.target.addEventListener) {
                    this.target.addEventListener('DOMMouseScroll', this.event.disable, false);
                    this.target.addEventListener('wheel', this.event.disable, {
                        passive: false
                    });
                    this.target.addEventListener('mousewheel', this.event.disable, {
                        passive: false
                    });
                    this.target.addEventListener('keydown', this.event.keydown, false);
                }
                if ('ontouchstart' in document.documentElement) {
                    this.target.addEventListener('touchstart', this.event.disableHard, false);
                    this.target.addEventListener('touchmove', this.event.disableHard, false);
                }
            }

        }
    }
    enable = () => {
        console.log('scroll enable');
        this.scrolldisabled = false;
        if (this.target === null) {
            if (typeof document !== `undefined`) {
                document.body.classList.remove('__disablescroll');
            }
            if (window.addEventListener) {
                window.removeEventListener('DOMMouseScroll', this.event.disable, false);
                window.removeEventListener('wheel', this.event.disable, {
                    passive: false
                });
                window.removeEventListener('mousewheel', this.event.disable, {
                    passive: false
                });
                window.removeEventListener('keydown', this.event.keydown, false);
            }
            if ('ontouchstart' in document.documentElement) {
                window.ontouchstart =  this.event.disableHard;
                window.removeEventListener('touchstart', this.event.disableHard, false);
                window.removeEventListener('touchmove', this.event.disableHard, false);
                document.body.removeEventListener('touchstart', this.event.disableHard, false);
                document.body.removeEventListener('touchmove', this.event.disableHard, false);
                document.removeEventListener('touchstart', this.event.disableHard, false);
                document.removeEventListener('touchmove', this.event.disableHard, false);
                document.documentElement.removeEventListener('touchstart', this.event.disableHard, false);
                document.documentElement.removeEventListener('touchmove', this.event.disableHard, false);
            }
        } else {
            if (this.target.addEventListener) {
                this.target.removeEventListener('DOMMouseScroll', this.event.disable, false);
                this.target.removeEventListener('wheel', this.event.disable, {
                    passive: false
                });
                this.target.removeEventListener('mousewheel', this.event.disable, {
                    passive: false
                });
                this.target.removeEventListener('keydown', this.event.keydown, false);
            }
            if ('ontouchstart' in document.documentElement) {
                this.target.removeEventListener('touchstart', this.event.disableHard, false);
                this.target.removeEventListener('touchmove', this.event.disableHard, false);
                this.target.removeEventListener('touchend', this.event.disableHard, false);
            }
        }
    }
    event = {
        disable(e) {
            e = e || window.event;
            if (e.preventDefault) e.preventDefault();
            e.returnValue = false;
        },
        disableHard(e) {
            e.preventDefault();
        },
        keydown: (e) => {
            if (e.which === 38 || e.which === 40 || e.which === 32) {
                e = e || window.event;
                if (e.preventDefault) e.preventDefault();
                e.returnValue = false;
            }
        }
    }
}
