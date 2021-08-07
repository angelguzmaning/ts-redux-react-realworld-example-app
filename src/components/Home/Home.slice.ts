import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Article } from '../../types/article';
import * as R from 'ramda';

export interface HomeArticle {
  article: Article;
  isSubmitting: boolean;
}

export interface HomeState {
  articles: Option<readonly HomeArticle[]>;
  tags: Option<string[]>;
}

const initialState: HomeState = {
  articles: None,
  tags: None,
};

const slice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    startLoading: () => ({ articles: None, tags: None }),
    loadArticles: (state, { payload: articles }: PayloadAction<Article[]>) => {
      state.articles = Some(articles.map((article) => ({ article, isSubmitting: false })));
    },
    loadTags: (state, { payload: tags }: PayloadAction<string[]>) => {
      state.tags = Some(tags);
    },
    startSubmittingFavorite: (state, { payload: index }: PayloadAction<number>) => {
      state.articles = state.articles.map(R.adjust(index, R.assoc('isSubmitting', true)));
    },
    endSubmittingFavorite: (
      state,
      { payload: { article, index } }: PayloadAction<{ index: number; article: Article }>
    ) => {
      state.articles = state.articles.map(R.update<HomeArticle>(index, { article, isSubmitting: false }));
    },
  },
});

export const { startLoading, loadArticles, loadTags, startSubmittingFavorite, endSubmittingFavorite } = slice.actions;

export default slice.reducer;
