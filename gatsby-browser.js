exports.onRouteUpdate = ({
    location
}) => {
}
exports.onClientEntry = () => {
    // console.log("First Time Site is loaded")
}

exports.onPreRouteUpdate = ({ location }) => {
    //DETECT TOUCH EVENT AND IOS
	if (!('ontouchstart' in document.documentElement)) {
		document.body.classList.add('onhover');
	}

    const isSafari = !!navigator.userAgent.match(/Version\/[\d]+.*Safari/);
	const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
	if(isSafari && iOS){
		document.body.classList.add('iOSsafari');
	}
};

// DELAY SCROLL UPDATE
const transitionDelay = 2000

exports.shouldUpdateScroll = ({
    routerProps: {
        location
    },
    getSavedScrollPosition,
}) => {
    if (location.action === 'PUSH') {
        window.setTimeout(() => window.scrollTo(0, 0), transitionDelay)
    } else {
        const savedPosition = getSavedScrollPosition(location)
        window.setTimeout(
            () => window.scrollTo(...(savedPosition || [0, 0])),
            transitionDelay
        )
    }
    return false
}
