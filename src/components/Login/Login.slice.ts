import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GenericErrors } from '../../types/error';

export interface LoginState {
  email: string;
  password: string;
  errors: GenericErrors;
  loginIn: boolean;
}

const initialState: LoginState = {
  email: '',
  password: '',
  errors: {},
  loginIn: false,
};

const slice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    initialize: () => initialState,
    updateEmail: (state, { payload: email }: PayloadAction<string>) => {
      state.email = email;
    },
    updatePassword: (state, { payload: password }: PayloadAction<string>) => {
      state.password = password;
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

export const { initialize, updateEmail, updatePassword, updateErrors, startLoginIn } = slice.actions;

export default slice.reducer;
