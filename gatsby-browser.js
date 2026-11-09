exports.onRouteUpdate = ({
    location
}) => {
}
exports.onClientEntry = () => {
    // Netlify Identity emails link to the site root with the token in the hash.
    // gatsby-plugin-decap-cms@4.0.4 should load the widget here, but its compiled
    // require(variable) makes webpack bundle an empty module, so it always throws.
    // /admin/ loads the widget itself, so hand the token over to it.
    const { hash } = window.location;
    if (/(confirmation|invite|recovery|email_change)_token=|access_token=|error=access_denied&error_description=403/.test(hash)) {
        window.location.replace(`/admin/${hash}`);
    }
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
// const transitionDelay = 500

// exports.shouldUpdateScroll = ({
//     routerProps: {
//         location
//     },
//     getSavedScrollPosition,
// }) => {
//     window.setTimeout(() => window.scrollTo(0, 0), transitionDelay)

//     if (location.action === 'PUSH') {
//     } else {
//         const savedPosition = getSavedScrollPosition(location)
//         window.setTimeout(
//             () => window.scrollTo(...(savedPosition || [0, 0])),
//             transitionDelay
//         )
//     }
//     return false
// }
