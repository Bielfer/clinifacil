import { useToast } from '@/components/core/Toast';
import { useState } from 'react';

type CopiedValue = string | null;

type CopyFn = (text: string) => Promise<boolean>; // Return success

interface ReturnType {
  copiedText: CopiedValue;
  copy: CopyFn;
  copySucceeded: boolean;
}

const useCopyToClipboard = (): ReturnType => {
  const { addToast } = useToast();
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);
  const copySucceeded = !!copiedText;

  const copy: CopyFn = async (text) => {
    if (!navigator?.clipboard) {
      addToast({
        content: 'Copiar não é suportado nesse dispositivo',
        type: 'error',
      });

      return false;
    }

    try {
      await navigator.clipboard.writeText(text);

      setCopiedText(text);

      return true;
    } catch (error) {
      addToast({ content: 'Falha ao copiar', type: 'error' });

      setCopiedText(null);

      return false;
    }
  };

  return { copiedText, copy, copySucceeded };
};

export default useCopyToClipboard;
