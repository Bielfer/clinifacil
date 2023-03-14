import Header from '@/components/core/Header';
import LoadingWrapper from '@/components/core/LoadingWrapper';
import Footer from '@/components/landing/Footer';
import { Page } from '@/types/auth';
import Head from 'next/head';
import { useState } from 'react';

const Contact: Page = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <Head>
        <title>CliniFácil | Fale Conosco</title>
      </Head>
      <Header />
      <main className="flex flex-col items-center py-16">
        <LoadingWrapper loading={isLoading} hiddenChildren>
          <iframe
            src="https://tally.so/embed/mRx5r4?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
            loading="lazy"
            height="500"
            title="Fale Conosco"
            onLoad={() => setIsLoading(false)}
          />
        </LoadingWrapper>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
