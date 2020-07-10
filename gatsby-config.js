module.exports = {
  siteMetadata: {
    title: `Herbamojo Website`,
    siteUrl: `https://herbamojo.id`,
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `settings`,
        path: `${__dirname}/src/settings`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/static/assets`,
        name: 'assets',
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
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
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`,
      },
    },
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        precachePages: [`/`, `/journal/*`, `id/journal/*`],
        workboxConfig: {
          globPatterns: ['**/*'],
        },
      },
    },
    // `gatsby-plugin-remove-serviceworker`,
    `gatsby-plugin-netlify-cache`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-netlify-cms`,
      options: {
        htmlTitle: `Content Manager | HERBAMOJO`,
        htmlFavicon: `${__dirname}/static/icon.png`,
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
        defer: true,
      },
    },
    {
      resolve: `gatsby-plugin-facebook-pixel`,
      options: {
        pixelId: '1710911005709446',
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-unwrap-images`,
          `gatsby-remark-relative-images`,
        ],
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
