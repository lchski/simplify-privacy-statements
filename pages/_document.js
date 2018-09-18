import React from "react";
import Document, { Head, Main, NextScript } from "next/document";
import { extractCritical } from "emotion-server";
import flush from "styled-jsx/server";

const bodyStyling = {
  fontFamily: `sans-serif`,
  padding: 0,
  margin: 0,
  overflowX: "hidden"
};

const htmlStyling = {
  padding: 0,
  margin: 0
};

class MyDocument extends Document {
  static getInitialProps(ctx) {
    //eslint-disable-next-line react/display-name
    const page = ctx.renderPage(Component => props => <Component {...props} />);

    const emotionStyles = extractCritical(page.html);
    return {
      ...page,
      styles: (
        <React.Fragment>
          <style
            id="emotion-server-side"
            dangerouslySetInnerHTML={{ __html: emotionStyles.css }}
          />

          {flush() || null}
        </React.Fragment>
      )
    };
  }

  constructor(props) {
    super(props);
    const { __NEXT_DATA__, ids } = props;
    if (ids) {
      __NEXT_DATA__.ids = ids;
    }
  }

  render() {
    return (
      <html lang="en" style={htmlStyling}>
        <Head>
          <link
            rel="preload"
            href="/static/font/HKGrotesk-Regular.otf"
            as="font"
            type="font/otf"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/static/font/HKGrotesk-Bold.otf"
            as="font"
            type="font/otf"
            crossOrigin="anonymous"
          />
          <style dangerouslySetInnerHTML={{ __html: this.props.css }} />
          <link rel="icon" href="/static/favicon.ico" />
        </Head>
        <body style={bodyStyling}>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

export default MyDocument;
