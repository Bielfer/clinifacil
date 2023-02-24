import { toRenderField } from '@/constants/field-types';
import type {
  Handbook,
  HandbookField,
  HandbookFieldOption,
} from '@prisma/client';
import { useFormikContext } from 'formik';
import { FC, useEffect } from 'react';

type CompleteHandbook =
  | (Handbook & {
      fields: (HandbookField & {
        options: HandbookFieldOption[];
      })[];
    })
  | null
  | undefined;

type Props = {
  handbooks: CompleteHandbook[];
};

const HandbookFields: FC<Props> = ({ handbooks }) => {
  const { values, setFieldValue } = useFormikContext<{
    selectedHandbookId: number;
    handbook: CompleteHandbook;
  }>();
  const chosenHandbook = handbooks?.find(
    (handbook) => handbook?.id === values.selectedHandbookId
  );

  useEffect(() => {
    if (
      !values.selectedHandbookId ||
      values.selectedHandbookId === values.handbook?.id
    )
      return;

    setFieldValue('handbook', chosenHandbook);
  }, [
    values.selectedHandbookId,
    values.handbook?.id,
    chosenHandbook,
    setFieldValue,
  ]);

  return (
    <div className="grid gap-y-3">
      {values.handbook?.fields.map((field, idx) =>
        toRenderField({
          key: `${field.label} ${idx}`,
          field: field.type,
          label: field.label,
          name: `handbook.fields.${idx}.value`,
          options: field.options,
        })
      )}
    </div>
  );
};

export default HandbookFields;
