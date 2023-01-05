import {
  ChangeEvent,
  FC,
  InputHTMLAttributes,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useField } from 'formik';
import Input from '@/components/core/Input';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  password?: boolean;
  formatter?: string;
  hint?: string;
}

const FormikInput: FC<Props> = ({
  label,
  name,
  password,
  formatter,
  className,
  hint,
  ...props
}) => {
  const [{ value }, { error, touched }, { setValue }] = useField(name);
  const [formattedValue, setFormattedValue] = useState('');

  const formatValue = useCallback(
    (valueParameter: string) => {
      if (!formatter) return valueParameter;

      const fieldValue = valueParameter.split('');
      const notUnderscoreIndexes = [];

      for (let i = 0; i < formatter.length; i += 1) {
        if (formatter[i] === '_') continue;

        notUnderscoreIndexes.push(i);
      }

      for (let i = 0; i < notUnderscoreIndexes.length; i += 1) {
        const toInsertCharacterIndex = notUnderscoreIndexes[i];

        if (toInsertCharacterIndex > fieldValue.length - 1) break;

        fieldValue.splice(
          toInsertCharacterIndex,
          0,
          formatter[toInsertCharacterIndex]
        );
      }

      return fieldValue.join('');
    },
    [formatter]
  );

  const removeFormatterCharacters = (valueParameter: string) => {
    if (!formatter) return valueParameter;

    const formatterCharacters: { [key: string]: boolean } = {};

    for (let i = 0; i < formatter.length; i += 1) {
      const formatterCharacter = formatter[i];

      if (formatterCharacter === '_') continue;

      formatterCharacters[formatterCharacter] = true;
    }

    const arrayFormatterCharacters = Object.keys(formatterCharacters);

    return valueParameter
      .split('')
      .filter((character) => !arrayFormatterCharacters.includes(character))
      .join('');
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!formatter) {
      setValue(e.target.value);
      return;
    }

    const valueWithoutFormatter = removeFormatterCharacters(e.target.value);

    setValue(valueWithoutFormatter);
    setFormattedValue(formatValue(valueWithoutFormatter));
  };

  useEffect(() => {
    if (!formatter) return;

    setFormattedValue(formatValue(value));
  }, [formatValue, formatter, value]);

  return (
    <Input
      value={formatter ? formattedValue : value}
      onChange={handleChange}
      width="100%"
      password={password}
      label={label}
      className={className}
      error={touched && error ? error : ''}
      hint={hint}
      {...props}
    />
  );
};

export default FormikInput;
