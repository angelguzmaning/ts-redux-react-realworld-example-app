export function FormGroup(props: {
  type: string;
  placeholder: string;
  disabled: boolean;
  value: string;
  onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <fieldset className='form-group'>
      <input className='form-control form-control-lg' {...props} />
    </fieldset>
  );
}

export function TextAreaFormGroup(props: {
  type: string;
  placeholder: string;
  disabled: boolean;
  rows: number;
  value: string;
  onChange: (ev: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <fieldset className='form-group'>
      <textarea className='form-control form-control-lg' {...props}></textarea>
    </fieldset>
  );
}
