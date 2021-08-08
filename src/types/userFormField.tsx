export interface UserFormField {
  name: string;
  type: string;
  placeholder: string;
  rows?: number;
  fieldType: 'input' | 'texarea';
}

export function buildUserFormField(data: Partial<UserFormField> & { name: string }): UserFormField {
  return {
    type: 'text',
    placeholder: '',
    fieldType: 'input',
    ...data,
  };
}
