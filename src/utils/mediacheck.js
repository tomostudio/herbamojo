export const MediaCheck = {
    //VARIABLES
    v: {
        //WIDTH
        w: {
            small: 450,
            mobile: 700,
            mtablet: 800,
            tablet: 1024,
            desktop: 1280
        },
        //HEIGHT
        h: {
            short: 500
        }
    },
    width: {
        get: () => {
            if (typeof window !== `undefined`) {
                const W = window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
                if (W <= MediaCheck.v.w.desktop) {
                    if (W <= MediaCheck.v.w.tablet) {
                        if (W <= MediaCheck.v.w.mobile) {
                            if (W <= MediaCheck.v.w.small) {
                                return 'SMALL';
                            } else {
                                return 'MOBILE';
                            }
                        } else {
                            return 'TABLET';
                        }
                    } else {
                        return 'DESKTOP';
                    }
                } else {
                    return 'LARGE';
                }
            }
        },
        small: () => (MediaCheck.checkWidth(MediaCheck.v.w.small)),
        mobile: () => (MediaCheck.checkWidth(MediaCheck.v.w.mobile)),
        mtablet: () => (MediaCheck.checkWidth(MediaCheck.v.w.mtablet)),
        tablet: () => (MediaCheck.checkWidth(MediaCheck.v.w.tablet)),
        desktop: () => (MediaCheck.checkWidth(MediaCheck.v.w.desktop))
    },
    height: {
        get: () => {
            if (typeof window !== `undefined`) {
                const H = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
                if (H <= MediaCheck.v.h.short) {
                    return 'SHORT';
                } else {
                    return 'TALL';
                }
            }
        },
        short: () =>  (MediaCheck.checkHeight(MediaCheck.v.h.short))
    },
    //MAIN CHECKER
    checkHeight: (tresh) => {
        if (typeof window !== `undefined`) {
            const H = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
            if (H <= tresh) {
                return true;
            } else {
                return false;
            }
        }
    },
    checkWidth: (tresh) => {
        if (typeof window !== `undefined`) {
            const W = window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
            if (W <= tresh) {
                return true;
            } else {
                return false;
            }
        }
    },
}
