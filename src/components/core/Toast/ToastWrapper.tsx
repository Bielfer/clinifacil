import { ReactNode } from 'react';
import ToastContainer from './Container';
import ToastProvider from './context';

interface Props {
  children: ReactNode;
}

const ToastWrapper = ({ children }: Props) => (
  <ToastProvider>
    {children}
    <ToastContainer />
  </ToastProvider>
);

export default ToastWrapper;
