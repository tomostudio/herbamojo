exports.onRouteUpdate = ({
    location
}) => {
    console.log('Route Updated', location.pathname)
    if (location.pathname.includes("blog")) {
        // document.body.classList.remove('preloading');
    }
}
exports.onClientEntry = () => {
    console.log("First Time Site is loaded")
    document.body.classList.add('preloading');
}
exports.onPreRouteUpdate = ({
    location
}) => {
    console.log("Preroute Update", location.pathname)
    document.body.classList.add('preloading');
}

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
