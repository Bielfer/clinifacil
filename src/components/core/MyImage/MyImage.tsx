import clsx from 'clsx';
import Image from 'next/image';
import { ComponentProps } from 'react';
import styles from './MyImage.module.css';

type Props = Omit<ComponentProps<typeof Image>, 'width' | 'height'>;

const MyImage = ({ className, alt, ...props }: Props) => (
  <div className={clsx(styles.imageContainer, className)}>
    <Image className={styles.image} alt={alt} {...props} />
  </div>
);

export default MyImage;
