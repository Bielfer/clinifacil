/* eslint react/no-array-index-key:off */
import clsx from 'clsx';
import { Field, useField } from 'formik';
import type { FC } from 'react';
import InputLayout from '../core/InputLayout';
import Table from '../core/Table';
import Text from '../core/Text';

type Props = {
  name: string;
  label?: string | null;
  hint?: string;
  className?: string;
};

const FormikTable: FC<Props> = ({ name, label, hint, className }) => {
  const [{ value }, { touched, error }] = useField<string[][]>(name);

  const [headers, ...body] = value;

  return (
    <InputLayout
      name={name}
      className={className}
      error={touched && error ? error : ''}
      hint={hint}
    >
      {label && (
        <Text label className="pb-3 text-xl">
          {label}
        </Text>
      )}
      <Table className="w-full px-2">
        <Table.Head>
          {headers.map((header, idx) => (
            <Table.Header
              key={header}
              className={clsx(idx !== 0 && 'border-l border-gray-300')}
            >
              {header}
            </Table.Header>
          ))}
        </Table.Head>
        <Table.Body>
          {body.map((row, idxRow) => (
            <Table.Row key={idxRow}>
              {row.map((data, idxCol) => (
                <Table.Data
                  key={idxCol}
                  className={clsx(
                    idxCol === 0 ? 'font-semibold' : 'border-l border-gray-300'
                  )}
                >
                  {idxCol === 0 ? (
                    data
                  ) : (
                    <Field
                      name={`${name}[${idxRow + 1}][${idxCol}]`}
                      className="h-full w-full text-center outline-none"
                      autocomplete="off"
                    />
                  )}
                </Table.Data>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </InputLayout>
  );
};

export default FormikTable;
