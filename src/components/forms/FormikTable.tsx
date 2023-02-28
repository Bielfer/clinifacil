/* eslint react/no-array-index-key:off */
import { tableFormatters } from '@/helpers/formatters';
import { useTableArrowNavigation } from '@/hooks';
import clsx from 'clsx';
import { Field, useField } from 'formik';
import { FC } from 'react';
import InputLayout from '../core/InputLayout';
import Table from '../core/Table';
import Text from '../core/Text';

type Props = {
  name: string;
  label?: string | null;
  hint?: string;
  className?: string;
  formatters?: string[][];
};

const FormikTable: FC<Props> = ({
  name,
  label,
  hint,
  className,
  formatters,
}) => {
  const [{ value }, { touched, error }, { setValue }] =
    useField<string[][]>(name);
  const { tableRef } = useTableArrowNavigation();

  const [headers, ...body] = value;
  const firstColumnEmpty =
    Array.isArray(value) && value.every((row) => row?.[0] === '');

  return (
    <InputLayout
      name={name}
      className={className}
      error={touched && error ? error : ''}
      hint={hint}
    >
      {label && (
        <Text label className="pb-3">
          {label}
        </Text>
      )}
      <Table className="w-full px-2" ref={tableRef}>
        <Table.Head>
          {headers.map((header, idx) => (
            <Table.Header
              key={header}
              className={clsx(
                idx !== 0 && 'border-l border-gray-300',
                firstColumnEmpty && idx === 0 && 'hidden',
                firstColumnEmpty && idx === 1 && 'border-l-0'
              )}
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
                    idxCol === 0 ? 'font-semibold' : 'border-l border-gray-300',
                    firstColumnEmpty && idxCol === 0 && 'hidden',
                    firstColumnEmpty && idxCol === 1 && 'border-l-0'
                  )}
                >
                  {idxCol === 0 ? (
                    data
                  ) : (
                    <Field
                      name={`${name}[${idxRow + 1}][${idxCol}]`}
                      className="h-full w-full text-center leading-10 outline-none"
                      autoComplete="off"
                      onBlur={() => {
                        const formatter =
                          formatters &&
                          tableFormatters[formatters[idxRow + 1][idxCol]];

                        if (!formatter) return;

                        const valueCopy = [...value];
                        valueCopy[idxRow + 1][idxCol] = formatter(
                          value[idxRow + 1][idxCol]
                        );

                        setValue(valueCopy);
                      }}
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
