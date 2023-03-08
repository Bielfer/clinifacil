import Button from '@/components/core/Button';
import IconButton from '@/components/core/IconButton';
import LoadingWrapper from '@/components/core/LoadingWrapper';
import { trpc } from '@/services/trpc';
import { PhotoIcon } from '@heroicons/react/20/solid';
import { FC, useState } from 'react';
import Modal from '../../core/Modal';

type Props = {
  imageUrl: string;
};

const ImageExamModal: FC<Props> = ({ imageUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: presignedImageUrl, isLoading } =
    trpc.exam.getPresignedUrl.useQuery({ imageUrl }, { enabled: isOpen });

  return (
    <>
      <Button
        className="hidden sm:inline-flex"
        variant="link-primary"
        iconLeft={PhotoIcon}
        size="sm"
        onClick={() => setIsOpen(true)}
      >
        Ver
      </Button>
      <IconButton
        className="sm:hidden"
        variant="link-primary"
        icon={PhotoIcon}
        size="lg"
        onClick={() => setIsOpen(true)}
      />
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="max-w-2xl"
      >
        <LoadingWrapper loading={isLoading}>
          <img src={presignedImageUrl} alt="exame de imagem" />
        </LoadingWrapper>
      </Modal>
    </>
  );
};

export default ImageExamModal;
