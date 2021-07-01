module.exports = {
  siteMetadata: {
    title: `Herbamojo Website`,
    siteUrl: `https://herbamojo.id`,
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/static/assets`,
        name: 'assets',
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `settings`,
        path: `${__dirname}/src/settings`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `journal`,
        path: `${__dirname}/src/journal`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `journal_id`,
        path: `${__dirname}/src/journal_id`,
      },
    },
    `gatsby-plugin-preload-fonts`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Gatsby Starter',
        short_name: 'gatsbyStarter',
        start_url: '/',
        background_color: '#000000',
        theme_color: '#15C87F',
        display: 'standalone',
        icon: 'src/images/icon/icon.png',
        cache_busting_mode: 'none',
      },
    },
    // {
    //   resolve: `gatsby-plugin-offline`,
    //   options: {
    //     precachePages: [`/`, `/journal/*`, `id/journal/*`],
    //     workboxConfig: {
    //       globPatterns: ['**/*'],
    //     },
    //   },
    // },
    `gatsby-plugin-remove-serviceworker`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        implementation: require("sass"),
      },
    },
    `gatsby-plugin-layout`,
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        exclude: [`/@deploystatus`],
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-97840044-2',
        exclude: ['/@deploystatus'],
      },
    },
    {
      resolve: `gatsby-plugin-facebook-pixel`,
      options: {
        pixelId: '1710911005709446',
      },
    },
    `gatsby-plugin-remove-trailing-slashes`,
    {
      resolve: 'gatsby-plugin-google-tagmanager',
      options: {
        id: 'GTM-TCS8HZ3',

        // Include GTM in development.
        //
        // Defaults to false meaning GTM will only be loaded in production.
        includeInDevelopment: false,

        // datalayer to be set before GTM is loaded
        // should be an object or a function that is executed in the browser
        //
        // Defaults to null
        defaultDataLayer: { platform: 'gatsby' },

        // Specify optional GTM environment details.
        // gtmAuth: 'YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_AUTH_STRING',
        // gtmPreview: 'YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_PREVIEW_NAME',
        // dataLayerName: 'dataLayer',

        // Name of the event that is triggered
        // on every Gatsby route change.
        //
        // Defaults to gatsby-route-change
        // routeChangeEventName: 'YOUR_ROUTE_CHANGE_EVENT_NAME',
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-transformer-remark`,
      // resolve: `gatsby-plugin-mdx`,
      options: {
        // extensions: [`.md`, `.mdx`], // highlight-line
        // gatsbyRemarkPlugins: [
          plugins: [
          {
            resolve: `gatsby-remark-relative-images`,
            options: { staticFolderName: 'static' },
          },
          `gatsby-remark-unwrap-images`,
          `gatsby-remark-images`,
        ],
      },
    },
    {
      resolve: `gatsby-plugin-netlify-cms`,
      options: {
        htmlTitle: `Content Manager | HERBAMOJO`,
        htmlFavicon: `${__dirname}/static/icon.png`,
      },
    },
    {
      resolve: `gatsby-plugin-netlify`,
      options: {
        headers: {
          '/*': ['Cache-Control: max-age=31536000'],
          '/assets/*': [
            // matching headers (by type) are replaced by Netlify with more specific routes
            'Cache-Control: max-age=31536000',
          ],
          '/journal/*': [
            // matching headers (by type) are replaced by Netlify with more specific routes
            'Cache-Control: no-cache',
          ],
        },
        generateMatchPathRewrites: false, // boolean to turn off automatic creation of redirect rules for client only paths
      },
    },
  ],
};
