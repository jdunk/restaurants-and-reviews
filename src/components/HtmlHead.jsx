import Head from 'next/head';

export default function HtmlHead() {
  return (
    <Head>
      <title>Restaurants &amp; Ratings</title>
      <meta name="description" content="Local Restaurants, Ratings, and Comments" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}