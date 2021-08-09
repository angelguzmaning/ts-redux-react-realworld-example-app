import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Article, MultipleArticles } from '../../types/article';
import * as R from 'ramda';

export interface HomeArticle {
  article: Article;
  isSubmitting: boolean;
}

export interface HomeState {
  articles: Option<readonly HomeArticle[]>;
  tags: Option<string[]>;
  currentPage: number;
  articlesCount: number;
}

const initialState: HomeState = {
  articles: None,
  tags: None,
  currentPage: 1,
  articlesCount: 0,
};

const slice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    startLoading: () => initialState,
    loadArticles: (state, { payload: { articles, articlesCount } }: PayloadAction<MultipleArticles>) => {
      state.articles = Some(articles.map((article) => ({ article, isSubmitting: false })));
      state.articlesCount = articlesCount;
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
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.articles = None;
    },
  },
});

export const { startLoading, loadArticles, loadTags, startSubmittingFavorite, endSubmittingFavorite, changePage } =
  slice.actions;

export default slice.reducer;
