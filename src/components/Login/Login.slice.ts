import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginError } from '../../types/login';

export interface LoginState {
  email: string;
  password: string;
  errors: LoginError;
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
    updateErrors: (state, { payload: errors }: PayloadAction<LoginError>) => {
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
