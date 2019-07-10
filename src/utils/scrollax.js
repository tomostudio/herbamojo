// new InViewportClass({target: 'div.inview', visibility: 0});
export class Scrollax {
    scrollmovement = .25;
    scrolltarget = null;
    alternate_left = false;
    alternate_right = false;
    center = {
        y: 0
    }
    constructor(obj) {
        this.scrollmovement = obj.scroll_movement !== undefined ? obj.scroll_movement : 0.25;

        this.scrolltarget = obj.target || null;
        if (typeof this.scrolltarget === 'string') {
            const targetelem = document.querySelector(this.scrolltarget);
            this.scrolltarget = targetelem;
        }
        this.center.y = this.scrolltarget.getBoundingClientRect().top;
        this.alternate_left = obj.alternate_left;
        this.alternate_right = obj.alternate_right;
        this.init();
    }
    set(obj) {
        if (obj.scroll_movement !== undefined) {
            this.scrollmovement = obj.scroll_movement
        }
        this.alternate_left = obj.alternate_left;
        this.alternate_right = obj.alternate_right;

        this.scrolltarget = obj.target || null;
        if (typeof this.scrolltarget === 'string') {
            const targetelem = document.querySelector(this.scrolltarget);
            this.scrolltarget = targetelem;
        }
        this.center.y = this.scrolltarget.getBoundingClientRect().top;
    }
    init() {
        window.addEventListener('scroll', this.scrollevent.bind(this), false);
    }
    kill() {
        window.removeEventListener('scroll', this.scrollevent.bind(this), false);
    }
    scrollevent(e) {
        const windowH = window.innerHeight || document.documentElement.clientHeight;
        if (this.scrolltarget !== null) {
            if (this.alternate_right && !this.alternate_left) {
                const movement = Math.round(this.scrolltarget.getBoundingClientRect().y / windowH * 500 * this.scrollmovement);
                this.scrolltarget.style.right = movement.toString() + "px";
            } else if (this.alternate_left && !this.alternate_right) {
                const movement = Math.round(this.scrolltarget.getBoundingClientRect().y / windowH * 500 * this.scrollmovement);
                this.scrolltarget.style.left = movement.toString() + "px";
            } else {
                const movement = Math.round(this.scrolltarget.getBoundingClientRect().y / windowH * 500 * this.scrollmovement);
                this.scrolltarget.style.top = movement.toString() + "px";
            }

        }
    }
}
