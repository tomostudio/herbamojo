// new InViewportClass({target: 'div.inview', visibility: 0});
export class InViewportClass {
    margin = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    };
    scrolltarget = null;
    visibility = .1;
    constructor(obj) {
        this.margin.top = obj.margin_top || 0;
        this.margin.right = obj.margin_right || 0;
        this.margin.bottom = obj.margin_bottom || 0;
        this.margin.left = obj.margin_left || 0;
        this.visibility = obj.visibility !== undefined ? obj.visibility : 0.1;

        this.scrolltarget = obj.target || null;
        if (typeof this.scrolltarget === 'string') {
            const targetelem = document.querySelector(this.scrolltarget);
            this.scrolltarget = targetelem;
        }

        if (obj.enter !== null && obj.enter !== undefined && typeof obj.enter === 'function') this.enter = obj.enter;
        if (obj.exit !== null && obj.exit !== undefined && typeof obj.exit === 'function') this.exit = obj.exit;
        if (obj.always !== null && obj.always !== undefined && typeof obj.always === 'function') this.always = obj.always;

        window.addEventListener('scroll', this.trigger.bind(this), false);
        this.trigger();
    }
    set(obj) {
        if (obj.margin_top) this.margin.top = obj.margin_top || 0;
        if (obj.margin_right) this.margin.right = obj.margin_right || 0;
        if (obj.margin_bottom) this.margin.bottom = obj.margin_bottom || 0;
        if (obj.margin_left) this.margin.left = obj.margin_left || 0;
        if (obj.visibility) this.visibility = obj.visibility !== undefined ? obj.visibility : 0.1;

        if (obj.target) {
            this.scrolltarget = obj.target || null;
            if (typeof this.scrolltarget === 'string') {
                const targetelem = document.querySelector(this.scrolltarget);
                this.scrolltarget = targetelem;
            }
        }

        if (obj.enter !== null && obj.enter !== undefined && typeof obj.enter === 'function') this.enter = obj.enter;
        if (obj.exit !== null && obj.exit !== undefined && typeof obj.exit === 'function') this.exit = obj.exit;
        if (obj.always !== null && obj.always !== undefined && typeof obj.always === 'function') this.always = obj.always;

        this.trigger();
    }
    kill() {
        window.removeEventListener('scroll', this.trigger.bind(this), false);
    }
    enter() {}
    exit() {}
    always() {}
    trigger() {
        if (this.scrolltarget !== null) {
            let inview = InViewportDetect(this.scrolltarget, this.margin.top, this.margin.right, this.margin.bottom, this.margin.left, this.visibility);
            this.always(inview);
            if (inview.detected) {
                this.enter(inview);
            } else {
                this.exit(inview);
            }
        }
    }
}

export const InViewportDetect = (target = null, top = 0, right = 0, bottom = 0, left = 0, visibility = .5) => {
    let returnobj = {
        detected: false,
        visibility: 0,
        targetdistance: null,
        margin: null
    }
    if (target !== null) {
        if (visibility > 1) {
            visibility = 1;
        }
        const visibleMultipler = 1 - visibility;

        if (typeof target === 'string') {
            const targetelem = document.querySelector(target);
            target = targetelem;
        }
        let distance = target.getBoundingClientRect();
        returnobj.targetdistance = distance;

        const margin = {
            top: top - distance.height * visibleMultipler,
            left: left - distance.width * visibleMultipler,
            bottom: ((window.innerHeight || document.documentElement.clientHeight) + distance.height * visibleMultipler - bottom),
            right: ((window.innerWidth || document.documentElement.clientWidth) + distance.width * visibleMultipler - right),
        }

        returnobj.margin = margin;

        let detected = false;
        if (distance.top >= margin.top &&
            distance.left >= margin.left &&
            distance.bottom <= margin.bottom &&
            distance.right <= margin.right) {
            detected = true;
        }
        //CALCULATE VISIBLE FROM
        let visibleLeft = Math.max(Math.min((distance.width - (left) + distance.left) / distance.width, 1), 0);
        let visibleRight = Math.max(Math.min((distance.width + (((window.innerWidth || document.documentElement.clientWidth) - right) - distance.right)) / distance.width, 1), 0);
        let visibleTop = Math.max(Math.min((distance.height - (top) + distance.top) / distance.height, 1), 0);
        let visibleBottom = Math.max(Math.min((distance.height + (((window.innerHeight || document.documentElement.clientHeight) - bottom) - distance.bottom)) / distance.height, 1), 0);

        //CALCULATE GET THE OVERALL MINIMUM VISIBLITY
        const visible = Math.min(visibleLeft, visibleRight, visibleTop, visibleBottom);

        returnobj.visibility = visible;
        returnobj.detected = detected;
    } else {
        returnobj.detected = false;
    }
    return returnobj

}
