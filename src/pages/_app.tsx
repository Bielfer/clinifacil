import { Inter, Nunito } from '@next/font/google';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import ToastWrapper from '@/components/core/Toast/ToastWrapper';
import { Page } from '@/types/auth';
import Auth from '@/components/core/Auth';
import { SessionProvider } from 'next-auth/react';
import { trpc } from '@/services/trpc';

const inter = Inter();
const nunito = Nunito({
  weight: ['500'],
});

interface ExtendedAppProps extends AppProps {
  Component: Page;
}

const MyApp = ({ Component, pageProps }: ExtendedAppProps) => (
  <>
    <SessionProvider session={pageProps.session}>
      <ToastWrapper>
        <Auth
          type={Component.auth}
          loggedInRedirect={Component.loggedInRedirect}
        >
          <Component {...pageProps} />
        </Auth>
      </ToastWrapper>
    </SessionProvider>
    <style jsx global>
      {`
        :root {
          --inter-font: ${inter.style.fontFamily};
          --nunito-font: ${nunito.style.fontFamily};
        }
      `}
    </style>
  </>
);

export default trpc.withTRPC(MyApp);
