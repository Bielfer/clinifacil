import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import ToastWrapper from '@/components/core/Toast/ToastWrapper';
import AuthProvider from '@/contexts/auth';
import { Page } from '@/types/auth';
import Auth from '@/components/core/Auth';
import { SessionProvider } from 'next-auth/react';
import { trpc } from '@/services/trpc';

interface ExtendedAppProps extends AppProps {
  Component: Page;
}

const MyApp = ({ Component, pageProps }: ExtendedAppProps) => (
  <SessionProvider session={pageProps.session}>
    <ToastWrapper>
      <AuthProvider>
        <Auth
          type={Component.auth}
          loggedInRedirect={Component.loggedInRedirect}
        >
          <Component {...pageProps} />
        </Auth>
      </AuthProvider>
    </ToastWrapper>
  </SessionProvider>
);

export default trpc.withTRPC(MyApp);
