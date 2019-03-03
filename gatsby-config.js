module.exports = {
    siteMetadata: {
        title: `Gatsby Starter`,
        siteUrl: `https://gatsbyv2.netlify.com`,
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
                background_color: "#6b37bf",
                theme_color: "#6b37bf",
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
        `gatsby-plugin-react-helmet`,
        `gatsby-plugin-sass`,
        `gatsby-plugin-netlify-cms`,
        `gatsby-transformer-sharp`,
        `gatsby-plugin-sharp`,
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
                    // netlifyCmsPaths, // Including in your Remark plugins will transform any paths in your markdown body
                    {
                        resolve: `gatsby-remark-relative-images`,
                    },
                    {
                        resolve: `gatsby-remark-images`,
                        options: {
                            // It's important to specify the maxWidth (in pixels) of
                            // the content container as this plugin uses this as the
                            // base for generating different widths of each image.
                            maxWidth: 1280,
                            backgroundColor: 'transparent', // required to display blurred image first
                        },
                    },
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
