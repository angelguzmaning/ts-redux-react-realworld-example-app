import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Article } from '../../types/article';

export interface HomeState {
  articles: Option<Article[]>;
  tags: Option<string[]>;
}

const initialState: HomeState = {
  articles: None,
  tags: None,
};

const slice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startLoading: () => ({ articles: None, tags: None }),
    loadArticles: (state, { payload: articles }: PayloadAction<Article[]>) => {
      state.articles = Some(articles);
    },
    loadTags: (state, { payload: tags }: PayloadAction<string[]>) => {
      state.tags = Some(tags);
    },
  },
});

export const { startLoading, loadArticles, loadTags } = slice.actions;

export default slice.reducer;
