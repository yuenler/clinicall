// pages/_app.js
import { ContextProvider } from "../context/Context";
import "../styles/globals.css";

import Script from "next/script";

function MyApp({ Component, pageProps }) {
  return (
    <ContextProvider>
      <Component {...pageProps} />
      <Script src="https://accounts.google.com/gsi/client"></Script>
    </ContextProvider>
  );
}

export default MyApp;
