import Head from 'next/head';
import '../styles/globals.css'; // Import global CSS here
import '../styles/Home.module.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Essential metadata tags */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Explore our AI-powered commentary on climate change." />
        <meta name="keywords" content="your, keywords, here" />

        <link rel="icon" href="/logo.svg" />
      
        {/* Open Graph and Twitter Card tags (for social sharing) */}
        <meta property="og:title" content="Chatting about the News" />
        <meta property="og:description" content="Explore our AI-powered commentary on climate change." />
        <meta property="og:image" content="/logo.svg" />
        <meta property="og:url" content="https://chatting.jack-robertson.co.uk/" />
        <meta name="twitter:card" content="summary_large_image" />

      
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
