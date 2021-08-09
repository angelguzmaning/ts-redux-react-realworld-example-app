import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GenericErrors } from '../../../types/error';

export interface LoginState {
  user: {
    email: string;
    password: string;
  };
  errors: GenericErrors;
  loginIn: boolean;
}

const initialState: LoginState = {
  user: {
    email: '',
    password: '',
  },
  errors: {},
  loginIn: false,
};

const slice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    initialize: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof LoginState['user']; value: string }>
    ) => {
      state.user[name] = value;
    },
    updateErrors: (state, { payload: errors }: PayloadAction<GenericErrors>) => {
      state.errors = errors;
      state.loginIn = false;
    },
    startLoginIn: (state) => {
      state.loginIn = true;
    },
  },
});

export const { initialize, updateField, updateErrors, startLoginIn } = slice.actions;

export default slice.reducer;
