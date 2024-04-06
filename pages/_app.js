// pages/_app.js
import { ContextProvider } from "../context/Context";
import "../styles/globals.css";
import Head from 'next/head';



import Script from "next/script";

function MyApp({ Component, pageProps }) {
  return (
    <ContextProvider>
      <Head>
        <link rel="icon" href="/icon.png" />
      </Head>
      <Component {...pageProps} />
      <Script src="https://accounts.google.com/gsi/client"></Script>
    </ContextProvider>
  );
}

export default MyApp;
