import { IconType } from '@/types/core';
import clsx from 'clsx';
import type { FC } from 'react';
import Button, { ButtonProps } from '../Button';
import MyLink, { MyLinkProps } from '../MyLink';

type Props = {
  icon?: IconType;
  title: string;
  subtitle?: string;
  button?: ButtonProps;
  link?: MyLinkProps;
};

const EmptyState: FC<Props> = ({
  icon: Icon,
  title,
  subtitle,
  button,
  link,
}) => (
  <div className="text-center">
    {Icon && <Icon className="mx-auto h-12 w-12 text-gray-400" />}
    <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
    {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
    {button && (
      <Button {...button} className={clsx('mt-4', button.className)} />
    )}
    {link && <MyLink {...link} className={clsx('mt-4', link.className)} />}
  </div>
);

export default EmptyState;
