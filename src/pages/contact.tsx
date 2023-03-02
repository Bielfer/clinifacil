import Header from '@/components/core/Header';
import Footer from '@/components/landing/Footer';
import { Page } from '@/types/auth';
import Head from 'next/head';

const Contact: Page = () => (
  <>
    <Head>
      <title>CliniFácil | Fale Conosco</title>
    </Head>
    <Header />
    <main className="flex justify-center py-16">
      <iframe
        src="https://tally.so/embed/mRx5r4?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
        loading="lazy"
        height="500"
        title="Fale Conosco"
      />
    </main>
    <Footer />
  </>
);

export default Contact;
