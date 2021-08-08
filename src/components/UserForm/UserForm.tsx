import { FC, Fragment } from 'react';
import { FormGroup, TextAreaFormGroup } from '../FormGroup/FormGroup';
import { UserFormField } from '../../types/userFormField';
import { GenericErrors } from '../../types/error';
import { Errors } from '../Errors/Errors';

export interface UserFormProps {
  fields: UserFormField[];
  disabled: boolean;
  formObject: Record<string, string | null>;
  submitButtonText: string;
  errors: GenericErrors;
  onChange: (name: string, value: string) => void;
  onSubmit: (ev: React.FormEvent) => void;
}

export const UserForm: FC<UserFormProps> = ({
  fields,
  disabled,
  formObject,
  submitButtonText,
  errors,
  onChange,
  onSubmit,
}) => (
  <Fragment>
    <Errors errors={errors} />

    <form onSubmit={onSubmit}>
      <fieldset>
        {fields.map((field) =>
          field.fieldType === 'input' ? (
            <FormGroup
              key={field.name}
              disabled={disabled}
              type={field.type}
              placeholder={field.placeholder}
              value={formObject[field.name] || ''}
              onChange={_updateField(field.name, onChange)}
            />
          ) : (
            <TextAreaFormGroup
              key={field.name}
              disabled={disabled}
              type={field.type}
              placeholder={field.placeholder}
              value={formObject[field.name] || ''}
              rows={field.rows as number}
              onChange={_updateField(field.name, onChange)}
            />
          )
        )}
        <button className='btn btn-lg btn-primary pull-xs-right'>{submitButtonText}</button>
      </fieldset>
    </form>
  </Fragment>
);

function _updateField(
  name: string,
  onChange: UserFormProps['onChange']
): (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void {
  return ({ target: { value } }) => {
    onChange(name, value);
  };
}
