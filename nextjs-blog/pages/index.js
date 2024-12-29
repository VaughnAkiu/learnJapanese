import Head from 'next/head';
import Layout from '../components/layout';

const siteTitle = 'Practice Web App';

export default function Home({  }) {
  return (
    <>
      <Head>
          <title>{siteTitle}</title>
      </Head>
      <Layout></Layout>
    </>
  );
}
