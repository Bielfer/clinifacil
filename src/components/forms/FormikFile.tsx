import clsx from 'clsx';
import { useField } from 'formik';
import { useEffect, useRef, useState } from 'react';
import Button, { ButtonProps } from '../core/Button';
import Card from '../core/Card';
import InputLayout from '../core/InputLayout';

interface Props extends ButtonProps {
  name: string;
  hint?: string;
  label?: string;
  preview?: boolean;
  previewClassName?: string;
}

const FormikFile = ({
  className,
  name,
  children,
  label,
  hint,
  preview,
  previewClassName,
  ...props
}: Props) => {
  const [{ value }, { error, touched }, { setValue }] = useField<File | null>(
    name
  );
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!value || !preview) return () => {};

    const objectUrl = URL.createObjectURL(value);

    setImageUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [value, preview]);

  return (
    <>
      <InputLayout
        className={className}
        error={touched && error ? error : ''}
        hint={hint}
        label={label}
        name={name}
      >
        <input
          ref={inputRef}
          className="hidden"
          type="file"
          onChange={(e) => {
            const firstFile = e.target.files?.[0];

            if (!firstFile) return;

            setValue(firstFile);
          }}
        />
        <Button onClick={() => inputRef.current?.click()} {...props}>
          {children}
        </Button>
      </InputLayout>
      {preview && !!imageUrl && (
        <Card className="flex items-center justify-center bg-gray-100">
          <img
            src={imageUrl}
            alt="Preview exame de imagem"
            className={clsx(previewClassName, 'max-h-80')}
          />
        </Card>
      )}
    </>
  );
};

export default FormikFile;
