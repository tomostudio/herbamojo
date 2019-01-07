module.exports = {
    siteMetadata: {
      title: `Web Title`,
    },
    plugins: [
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
              name: "MALT Studio",
              short_name: "MALTstudio",
              start_url: "/",
              background_color: "#6b37bf",
              theme_color: "#6b37bf",
              // Enables "Add to Homescreen" prompt and disables browser UI (including back button)
              // see https://developers.google.com/web/fundamentals/web-app-manifest/#display
              display: "standalone",
            //   icon: "src/images/icon.png", // This path is relative to the root of the site.
            },
          },{
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `src`,
                path: `${__dirname}/src/`,
            },
        }, {
            resolve: `gatsby-plugin-typography`,
            options: {
                pathToConfigModule: `src/utils/typography.js`,
            },
        },
        `gatsby-plugin-offline`,
        `gatsby-plugin-react-helmet`,
        `gatsby-plugin-sass`,
        `gatsby-plugin-netlify-cms`,
        `gatsby-transformer-remark`,
    ],
}
