import { TrashIcon } from '@heroicons/react/20/solid';
import { PlusIcon } from '@heroicons/react/24/solid';
import { FieldArray, useField } from 'formik';
import { FC, useState } from 'react';
import Autocomplete from '../core/Autocomplete';
import IconButton from '../core/IconButton';
import Input from '../core/Input';
import Select from '../core/Select';

type Props = {
  name: string;
  label?: string;
  hint?: string;
  disabled?: boolean;
} & (
  | {
      component: 'input';
      options?: undefined;
    }
  | {
      component: 'autocomplete';
      options: { text: string; value: string }[];
    }
  | {
      component: 'select';
      options: { text: string; value: string }[];
    }
);

const FormikAdd: FC<Props> = ({
  name,
  options,
  label,
  hint,
  disabled,
  component = 'input',
}) => {
  const [, { error, touched }] = useField<string[]>(name);
  const [inputValue, setInputValue] = useState('');

  const errorMessage = (touched && error ? error : '') as string;

  const inputs: Record<typeof component, JSX.Element> = {
    input: (
      <Input
        className="flex-grow"
        label={label}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        name={name}
        error={errorMessage}
        hint={hint}
        disabled={disabled}
      />
    ),
    autocomplete: (
      <Autocomplete
        className="flex-grow"
        label={label}
        selected={inputValue}
        setSelected={(e) => setInputValue(e)}
        options={options ?? []}
        name={name}
        error={errorMessage}
        hint={hint}
        disabled={disabled}
      />
    ),
    select: (
      <Select
        className="flex-grow"
        label={label}
        selected={inputValue}
        setSelected={(e) => setInputValue(e)}
        options={options ?? []}
        name={name}
        error={errorMessage}
        hint={hint}
        disabled={disabled}
      />
    ),
  };

  return (
    <FieldArray name={name}>
      {({ form, push, remove }) => (
        <>
          <div className="flex items-end gap-x-3">
            {inputs[component]}
            <IconButton
              icon={PlusIcon}
              variant="primary"
              className="rounded-lg"
              size="lg"
              onClick={() => {
                if (!form.values[name].includes(inputValue)) push(inputValue);
                setInputValue('');
              }}
            />
          </div>
          {form.values[name].length > 0 && (
            <div className="mt-2 divide-y divide-gray-200 border-t border-b border-gray-200">
              {(form.values[name] as string[]).map((insertedValue, idx) => (
                <div
                  className="relative flex items-center py-4"
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
                    onClick={() => remove(idx)}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </FieldArray>
  );
};

export default FormikAdd;
