import type { NextPage } from 'next';
import Header from '@/components/core/Header';
import Hero from '@/components/core/Hero';

const Home: NextPage = () => (
  <>
    <Header />
    <main>
      <Hero />
    </main>
  </>
);

export default Home;
