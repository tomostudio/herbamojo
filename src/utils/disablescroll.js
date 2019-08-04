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
  disable() {
    console.log('scroll disable trigger', this.scrolldisabled);
    if (!this.scrolldisabled) {
      console.log('scroll disable', this.scrolldisabled);
      this.scrolldisabled = true;
      if (this.target === null) {
        if (typeof document !== `undefined`) {
          document.body.classList.add('__disablescroll');
          if ('ontouchstart' in document.documentElement) {
            document.body.classList.add('__disabletouch');
          }
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
          window.addEventListener('touchstart', this.event.disable, {
            passive: false
          });
          window.addEventListener('touchmove', this.event.disable, {
            passive: false
          });
          document.addEventListener('touchstart', this.event.disable, {
            passive: false
          });
          document.addEventListener('touchmove', this.event.disable, {
            passive: false
          });
        }
      } else {
        this.target.classList.add('__disablescroll');
        if (this.target.addEventListener) {
          this.target.addEventListener(
            'DOMMouseScroll',
            this.event.disable,
            false
          );
          this.target.addEventListener('wheel', this.event.disable, {
            passive: false
          });
          this.target.addEventListener('mousewheel', this.event.disable, {
            passive: false
          });
          this.target.addEventListener('keydown', this.event.keydown, false);
        }
        if ('ontouchstart' in document.documentElement) {
          this.target.addEventListener(
            'touchstart',
            this.event.disableHard,
            false
          );
          this.target.addEventListener(
            'touchmove',
            this.event.disableHard,
            false
          );
        }
      }
    }
  }
  enable = () => {
    console.log('scroll enable trigger', this.scrolldisabled);
    this.scrolldisabled = false;
    if (this.target === null) {
      console.log('scroll enable', this.scrolldisabled);
      if (typeof document !== `undefined`) {
        document.body.classList.remove('__disablescroll');
        document.body.classList.remove('__disabletouch');
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
        window.removeEventListener('touchstart', this.event.disable, {
          passive: false
        });
        window.removeEventListener('touchmove', this.event.disable, {
          passive: false
        });
        document.removeEventListener('touchstart', this.event.disable, {
          passive: false
        });
        document.removeEventListener('touchmove', this.event.disable, {
          passive: false
        });
      }
    } else {
      this.target.classList.remove('__disablescroll');
      if (this.target.addEventListener) {
        this.target.removeEventListener(
          'DOMMouseScroll',
          this.event.disable,
          false
        );
        this.target.removeEventListener('wheel', this.event.disable, {
          passive: false
        });
        this.target.removeEventListener('mousewheel', this.event.disable, {
          passive: false
        });
        this.target.removeEventListener('keydown', this.event.keydown, false);
      }
      if ('ontouchstart' in document.documentElement) {
        this.target.removeEventListener(
          'touchstart',
          this.event.disableHard,
          false
        );
        this.target.removeEventListener(
          'touchmove',
          this.event.disableHard,
          false
        );
        this.target.removeEventListener(
          'touchend',
          this.event.disableHard,
          false
        );
      }
    }
  };
  event = {
    disable(e) {
      console.log('touch soft');
      e = e || window.event;
      if (e.preventDefault) {
        e.preventDefault();
        e.stopPropagation();
      }
      e.returnValue = false;
    },
    disableHard: e => {
      console.log('touch hard', e);

      e.returnValue = false;
      e.cancelBubble = true;
      e.preventDefault();
      e.stopPropagation();
    },
    keydown: e => {
      if (e.which === 38 || e.which === 40 || e.which === 32) {
        e = e || window.event;
        if (e.preventDefault) e.preventDefault();
        e.returnValue = false;
      }
    }
  };
}
