import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/user';

export interface AppState {
  user: Option<User>;
}

const initialState: AppState = {
  user: None,
};

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    loadUser: (state, { payload: user }: PayloadAction<User>) => {
      state.user = Some(user);
    },
    logout: (state) => {
      state.user = None;
    },
  },
});

export const { loadUser, logout } = slice.actions;

export default slice.reducer;
