function GlobalStyle() {
    return (
        <style global jsx>{`
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                list-style: none;
            }
            body {
                background-image: url(/images/background.jpg);
                background-repeat: no-repeat;
                background-size: cover;
                background-blend-mode: normal;
                font-family: 'Open Sans', sans-serif;
            }
            /* App fit Height */
            html, body, #__next {
                min-height: 100vh;
                display: flex;
                flex: 1;
            }
            #__next {
                flex: 1;
            }
            #__next > * {
                flex: 1;
            }
            /* ./App fit Height */
        `}</style>
    );
}

export default function CustomApp({ Component, pageProps }) {
    return (
        <>
            <GlobalStyle />
            <Component {...pageProps} />
        </>
    );
}
