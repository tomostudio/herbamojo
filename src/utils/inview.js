// export const InView = {
//     v: {
//         margin: {
//             top: 0,
//             right: 0,
//             bottom: 0,
//             left: 0,
//         }
//     },
//     init: (obj) => {
//         window.addEventListener('scroll', InView.scrollevent, false);
//     },
//     scrollevent: () => {},
//     detect: (target) => {
//         let distance = target.getBoundingClientRect();
//         return (
//             distance.top >= InView.v.margin.top &&
//             distance.left >= InView.v.margin.left &&
//             distance.bottom <= ((window.innerHeight || document.documentElement.clientHeight) - InView.v.margin.bottom) &&
//             distance.right <= ((window.innerWidth || document.documentElement.clientWidth) - InView.v.margin.right)
//         );
//     },
//     kill: () => {
//         window.removeEventListener('scroll', InView.scrollevent, false);
//     }
// }

export class InViewClass {
    margin = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    };
    scrolltarget = null;
    visibility = .5;
    constructor(obj, scrolltarget, margin) {
        this.margin.top = obj.margin_top || 0;
        this.margin.right = obj.margin_right || 0;
        this.margin.bottom = obj.margin_bottom || 0;
        this.margin.left = obj.margin_left || 0;
        this.visibility = obj.visibility !== undefined ? obj.visibility : 0.5;

        this.scrolltarget = obj.target || null;
        if (typeof this.scrolltarget === 'string') {
            const targetelem = document.querySelector(this.scrolltarget);
            this.scrolltarget = targetelem;
        }
        this.init();
    }
    init() {
        window.addEventListener('scroll', this.scrollevent.bind(this), false);
    }
    kill() {
        window.removeEventListener('scroll', this.scrollevent.bind(this), false);
    }
    scrollevent(e) {
        if (this.scrolltarget !== null) {
            if (InViewDetect(this.scrolltarget, this.margin.top, this.margin.right, this.margin.bottom, this.margin.left, this.visibility)) {
                // console.log('detected', window.pageYOffset || document.documentElement.scrollTop);
            } else {}
        }
    }
}

export const InViewDetect = (target = null, top = 0, right = 0, bottom = 0, left = 0, visibility = .5) => {
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
        let detected = false;
        if (distance.top >= top - distance.height * visibleMultipler &&
            distance.left >= left - distance.width * visibleMultipler &&
            distance.bottom <= ((window.innerHeight || document.documentElement.clientHeight) + distance.height * visibleMultipler - bottom) &&
            distance.right <= ((window.innerWidth || document.documentElement.clientWidth) + distance.width * visibleMultipler - right)) {
            detected = true;

            //CALCULATE VISIBLE FROM
            let visibleLeft = Math.max(Math.min((distance.width - (left) + distance.left) / distance.width, 1), 0);
            let visibleRight = Math.max(Math.min((distance.width + (((window.innerWidth || document.documentElement.clientWidth) - right) - distance.right)) / distance.width, 1), 0) ;
            let visibleTop =  Math.max(Math.min((distance.height - (top) + distance.top) / distance.height, 1), 0);
            let visibleBottom = Math.max(Math.min((distance.height + (((window.innerHeight || document.documentElement.clientHeight) - bottom) - distance.bottom)) / distance.height, 1) , 0) ;

            //CALCULATE GET THE OVERALL MINIMUM VISIBLITY
            const visible = Math.min(visibleLeft, visibleRight, visibleTop, visibleBottom);
            console.log('detected', visible);
        }
        return detected;
    } else {
        return false;
    }

}
