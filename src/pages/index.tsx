/* eslint react/no-danger:off */
import type { NextPage } from 'next';
import Header from '@/components/core/Header';
import Hero from '@/components/core/Hero';
import Head from 'next/head';
import paths from '@/constants/paths';

const Home: NextPage = () => (
  <>
    <Head>
      <title>CliniFácil | A maneira mais fácil de gerir sua clínica</title>
      <script
        dangerouslySetInnerHTML={{
          __html: `
          if (document.cookie && document.cookie.includes('authed')) {
            window.location.href = "${paths.queue}"
          }
        `,
        }}
      />
    </Head>
    <Header />
    <main>
      <Hero />
    </main>
  </>
);

export default Home;
