import Head from 'next/head'
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>{'\u5BA2\u5236\u5316\u952E\u76D8\u6570\u636E\u5E93 | Custom Keyboard Database'}</title>
        <meta name="description" content={'\u5BA2\u5236\u5316\u952E\u76D8\u6570\u636E\u5E93 - \u6536\u5F55\u5404\u5DE5\u4F5C\u5BA4\u7684\u5BA2\u5236\u5316\u952E\u76D8\u4F5C\u54C1\u4FE1\u606F\uFF0C\u652F\u6301\u68C0\u7D22\u3001\u7B5B\u9009\u3001\u65F6\u95F4\u7EBF\u6D4F\u89C8\u3002Custom Keyboard Database \u2013 a curated collection of custom keyboard projects from various studios.'} />
        <meta name="keywords" content={'\u5BA2\u5236\u5316\u952E\u76D8,\u5BA2\u5236\u5316\u952E\u76D8\u6570\u636E\u5E93,Customized Keyboard Database,Customized Keyboard,Custom Keyboard,\u673A\u68B0\u952E\u76D8,\u952E\u76D8\u5DE5\u4F5C\u5BA4,\u952E\u76D8IC,\u952E\u76D8GB'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
        <link rel="shortcut icon" type="image/x-icon" href="/images/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/favicon.ico" />
        <meta property="og:title" content={'\u5BA2\u5236\u5316\u952E\u76D8\u6570\u636E\u5E93 | Custom Keyboard Database'} />
        <meta property="og:description" content={'\u6536\u5F55\u5404\u5DE5\u4F5C\u5BA4\u7684\u5BA2\u5236\u5316\u952E\u76D8\u4F5C\u54C1\u4FE1\u606F\uFF0C\u652F\u6301\u68C0\u7D22\u3001\u7B5B\u9009\u3001\u65F6\u95F4\u7EBF\u6D4F\u89C8\u3002'} />
        <meta property="og:type" content="website" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
