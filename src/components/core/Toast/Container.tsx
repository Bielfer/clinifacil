import { Transition } from '@headlessui/react';
import Toast from './Toast';
import { useToast } from './context';

const ToastContainer = () => {
  const { toasts } = useToast();

  return (
    <Transition appear show={toasts.length > 0}>
      <div className="absolute right-5 bottom-5 overflow-hidden flex flex-col gap-y-3 w-5/6 max-w-sm">
        {toasts.map((item) => (
          <Toast key={item.id} {...item} />
        ))}
      </div>
    </Transition>
  );
};

export default ToastContainer;
