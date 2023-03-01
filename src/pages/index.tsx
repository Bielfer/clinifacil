/* eslint react/no-danger:off */
import type { NextPage } from 'next';
import Header from '@/components/core/Header';
import Hero from '@/components/landing/Hero';
import Head from 'next/head';
import paths from '@/constants/paths';
import PrimaryFeatures from '@/components/landing/PrimaryFeatures';
import CallToAction from '@/components/landing/CallToAction';
import Footer from '@/components/landing/Footer';
import Pricing from '@/components/landing/Pricing';

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
      <PrimaryFeatures />
      <Pricing />
      <CallToAction />
    </main>
    <Footer />
  </>
);

export default Home;
