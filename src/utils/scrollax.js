// new InViewportClass({target: 'div.inview', visibility: 0});
export class Scrollax {
    defaultmovement = .25;
    scrolltarget = null;
    move = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    }
    transform = {
        x: 0,
        y: 0,
    }
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

        this.transform.x = obj.transform_x !== undefined ? obj.transform_x : 0;
        this.transform.y = obj.transform_y !== undefined ? obj.transform_y : 0;
        this.move.left = obj.move_left !== undefined ? obj.move_left : 0;
        this.move.right = obj.move_right !== undefined ? obj.move_right : 0;
        this.move.top = obj.move_top !== undefined ? obj.move_top : 0;
        this.move.bottom = obj.move_bottom !== undefined ? obj.move_bottom : 0;

        window.addEventListener('scroll', this.scrollevent, false);
    }
    set(obj) {
        if (obj.transform_x !== undefined) this.transform.x = obj.transform_x;
        if (obj.transform_y !== undefined) this.transform.y = obj.transform_y;
        if (obj.move_left !== undefined) this.move.left = obj.move_left;
        if (obj.move_right !== undefined) this.move.right = obj.move_right;
        if (obj.move_top !== undefined) this.move.top = obj.move_top;
        if (obj.move_bottom !== undefined) this.move.bottom = obj.move_bottom;

        if (obj.target !== undefined) {
            this.scrolltarget = obj.target || null;
            if (typeof this.scrolltarget === 'string') {
                const targetelem = document.querySelector(this.scrolltarget);
                this.scrolltarget = targetelem;
            }
            this.center.y = this.scrolltarget.getBoundingClientRect().top;
        }

    }
    kill() {
        window.removeEventListener('scroll', this.scrollevent, false);
    }
    trigger(){
        const windowH = window.innerHeight || document.documentElement.clientHeight;
        if (this.scrolltarget !== null) {
            let movement = {
                right: 0,
                left: 0,
                top: 0,
                bottom: 0,
                x: 0,
                y: 0,
            }

            if (this.move.right > 0) {
                movement.right = Math.round(this.scrolltarget.getBoundingClientRect().y / windowH * 500 * this.move.right);
                this.scrolltarget.style.right = movement.right.toString() + "px";
            }
            if (this.move.left > 0) {
                movement.left = Math.round(this.scrolltarget.getBoundingClientRect().y / windowH * 500 * this.move.left);
                this.scrolltarget.style.left = movement.left.toString() + "px";
            }

            if (this.move.top > 0) {
                movement.top = Math.round(this.scrolltarget.getBoundingClientRect().y / windowH * 500 * this.move.top);
                this.scrolltarget.style.top = movement.top.toString() + "px";
            }
            if (this.move.bottom > 0) {
                movement.bottom = Math.round(this.scrolltarget.getBoundingClientRect().y / windowH * 500 * this.move.bottom);
                this.scrolltarget.style.bottom = movement.bottom.toString() + "px";
            }

            if (this.transform.x > 0 || this.transform.y > 0) {
                movement.x = this.transform.x > 0 ? Math.round(this.scrolltarget.getBoundingClientRect().y / windowH * 100 * this.transform.x) : 0;
                movement.y = this.transform.y > 0 ? Math.round(this.scrolltarget.getBoundingClientRect().y / windowH * 100 * this.transform.y) : 0;
                this.scrolltarget.style.transform = `transform(${movement.x}%, ${movement.y}%)`;
            }
        }
    }
    scrollevent = (e) => {
        this.trigger();
    }
}
