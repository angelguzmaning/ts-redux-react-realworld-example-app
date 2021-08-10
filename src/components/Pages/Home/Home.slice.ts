import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface HomeState {
  tags: Option<string[]>;
}

const initialState: HomeState = {
  tags: None,
};

const slice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    startLoadingTags: () => initialState,
    loadTags: (state, { payload: tags }: PayloadAction<string[]>) => {
      state.tags = Some(tags);
    },
  },
});

export const { startLoadingTags, loadTags } = slice.actions;

export default slice.reducer;
