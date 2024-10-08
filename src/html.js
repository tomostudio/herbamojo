import React from "react";
import PropTypes from "prop-types";

export default function HTML(props) {
  return (
    <html {...props.htmlAttributes}>
      <head>
        <head
          dangerouslySetInnerHTML={{
            __html: `${"<!--                                                -->"}
            ${"<!-- 88888888   8888888   888    888   8888888          -->"}
            ${"<!--    88    88888888888 8888  8888 88888888888        -->"}
            ${"<!--    88    88888888888 88 8888 88 88888888888        -->"}
            ${"<!--    88    88888888888 88  88  88 88888888888        -->"}
            ${"<!--    88      8888888   88      88   8888888          -->"}
            ${"<!-- 8888888 88888888 88     88 8888888  88   8888888   -->"}
            ${"<!-- 88         88    88     88 88    88 88 88888888888 -->"}
            ${"<!-- 8888888    88    88     88 88    88 88 88888888888 -->"}
            ${"<!--      88    88    88     88 88    88 88 88888888888 -->"}
            ${"<!-- 8888888    88     8888888  8888888  88   8888888   -->"}
            ${"<!--                                                    -->"}
            ${"<!-- site by https://tomostudio.id                      -->"}
            ${"<!--                                                    -->"}`,
          }}
        />
        <meta charSet="utf-8" />
        <meta name="author" content="Hendhy Hutomo | hendhyhutomo.com" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="initial-scale=1, viewport-fit=cover" />
        <meta httpEquiv="Cache-Control" content="no-cache" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {props.headComponents}
      </head>
      <body {...props.bodyAttributes}>
        {props.preBodyComponents}
        <noscript key="noscript" id="gatsby-noscript">
          This app works best with JavaScript enabled.
        </noscript>
        <div
          key={`body`}
          id="___gatsby"
          dangerouslySetInnerHTML={{ __html: props.body }}
        />
        {props.postBodyComponents}
      </body>
    </html>
  );
}

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
};
