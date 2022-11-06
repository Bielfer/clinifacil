import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

interface Props {
  children: ReactNode;
}

export interface Toast {
  id?: number;
  content?: any;
  duration?: number;
  type?: 'success' | 'warning' | 'error' | 'default';
}

interface ContextType {
  addToast: (toast: Toast) => void;
  removeToast: (toastId: number) => void;
  toasts: Toast[];
}

const ToastContext = createContext({} as ContextType);

const ToastProvider = ({ children }: Props) => {
  const [id, setId] = useState(0);
  const [toasts, setToasts] = useState<Array<Toast>>([]);

  const addToast = useCallback(
    (toast: Toast) => {
      setId((prev) => prev + 1);
      setToasts((prev) => [...prev, { ...toast, id }]);
    },
    [id]
  );

  const removeToast = useCallback((toastId: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
  }, []);

  const value = useMemo(
    () => ({ addToast, removeToast, toasts }),
    [addToast, removeToast, toasts]
  );

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

export default ToastProvider;
