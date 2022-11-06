import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import ToastWrapper from '@/components/core/Toast/ToastWrapper';
import AuthProvider from '@/contexts/auth';
import { Page } from '@/types/auth';
import Auth from '@/components/core/Auth';

interface ExtendedAppProps extends AppProps {
  Component: Page;
}

const MyApp = ({ Component, pageProps }: ExtendedAppProps) => (
  <ToastWrapper>
    <AuthProvider>
      <Auth type={Component.auth}>
        <Component {...pageProps} />
      </Auth>
    </AuthProvider>
  </ToastWrapper>
);

export default MyApp;
