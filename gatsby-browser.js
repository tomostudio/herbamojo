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
}
exports.onPreRouteUpdate = ({
    location
}) => {
    console.log("Preroute Update", location.pathname)
    document.body.classList.add('preloading');
}
