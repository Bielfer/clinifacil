import { TrashIcon } from '@heroicons/react/20/solid';
import { useField } from 'formik';
import { FC, useState } from 'react';
import Autocomplete from '../core/Autocomplete';
import IconButton from '../core/IconButton';

type Props = {
  name: string;
  label?: string | null;
  hint?: string;
  disabled?: boolean;
  options: { text: string; value: string }[] | undefined;
};

const FormikAdd: FC<Props> = ({ name, options, label, hint, disabled }) => {
  const [{ value }, { error, touched, initialValue }, { setValue }] =
    useField<string[]>(name);
  const [inputValue, setInputValue] = useState<string[]>(initialValue ?? []);

  const errorMessage = (touched && error ? error : '') as string;

  const handleChange = (e: string[]) => {
    setInputValue(e);
    setValue(e);
  };

  return (
    <>
      <div className="flex items-end gap-x-3">
        <Autocomplete
          key={2}
          className="flex-grow"
          label={label}
          selected={inputValue}
          setSelected={(e) => handleChange(e as string[])}
          options={options ?? []}
          name={name}
          error={errorMessage}
          hint={hint}
          disabled={disabled}
          multiple
        />
      </div>
      <div className="px-2">
        {value.length > 0 && (
          <div className="mt-2 divide-y divide-gray-200 border-t border-b border-gray-200">
            {value.map((insertedValue) => (
              <div
                className="relative flex items-center py-2"
                key={insertedValue}
              >
                <div className="min-w-0 flex-1 text-sm">
                  <p className="select-none font-medium text-gray-700">
                    {insertedValue}
                  </p>
                </div>

                <IconButton
                  icon={TrashIcon}
                  variant="link-error"
                  onClick={() =>
                    handleChange(value.filter((item) => item !== insertedValue))
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FormikAdd;
