module.exports = {
    siteMetadata: {
        title: `Herbamojo Website`,
        siteUrl: `https://herbamojo.id`,
    },
    plugins: [{
            resolve: 'gatsby-source-filesystem',
            options: {
                path: `${__dirname}/static/assets`,
                name: 'assets',
            },
        }, {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: "Gatsby Starter",
                short_name: "gatsbyStarter",
                start_url: "/",
                background_color: "#000000",
                theme_color: "#15C87F",
                display: "standalone",
                icon: "src/images/icon/icon.png",
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `src`,
                path: `${__dirname}/src/`,
            },
        },
        `gatsby-plugin-offline`,
        // `gatsby-plugin-remove-serviceworker`,
        `gatsby-plugin-netlify-cache`,
        `gatsby-plugin-react-helmet`,
        `gatsby-plugin-sass`,
        `gatsby-plugin-netlify-cms`,
        `gatsby-plugin-layout`,
        `gatsby-plugin-sitemap`,
        {
            resolve: `gatsby-plugin-google-analytics`,
            options: {
                // replace "UA-XXXXXXXXX-X" with your own Tracking ID
                trackingId: "UA-XXXXXXXXX-X",
            }
        },
        {
            resolve: `gatsby-transformer-remark`,
            options: {
                plugins: [
                    `gatsby-remark-static-images`,
                    `gatsby-remark-unwrap-images`
                ],
            },
        },
        {
            resolve: `gatsby-plugin-netlify`,
            options: {
                generateMatchPathRewrites: false, // boolean to turn off automatic creation of redirect rules for client only paths
            },
        },
    ],
}
