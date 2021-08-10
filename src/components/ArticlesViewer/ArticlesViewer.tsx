import { Fragment } from 'react';
import { favoriteArticle, unfavoriteArticle } from '../../services/conduit';
import { store } from '../../state/store';
import { useStore } from '../../state/storeHooks';
import { Article } from '../../types/article';
import { ArticlePreview } from '../ArticlePreview/ArticlePreview';
import { Pagination } from '../Pagination/Pagination';
import { ArticleViewerState, endSubmittingFavorite, startSubmittingFavorite } from './ArticlesViewer.slice';

export function ArticlesViewer({ onPageChange }: { onPageChange?: (index: number) => void }) {
  const { articles, articlesCount, currentPage } = useStore(({ articleViewer }) => articleViewer);

  return (
    <Fragment>
      <div className='feed-toggle'>
        <ul className='nav nav-pills outline-active'>
          <li className='nav-item'>
            <a className='nav-link active' href=''>
              Global Feed
            </a>
          </li>
        </ul>
      </div>

      {renderArticles(articles)}

      <Pagination currentPage={currentPage} count={articlesCount} itemsPerPage={10} onPageChange={onPageChange} />
    </Fragment>
  );
}

function renderArticles(articles: ArticleViewerState['articles']) {
  return articles.match({
    none: () => [
      <div className='article-preview' key={1}>
        Loading articles...
      </div>,
    ],
    some: (articles) =>
      articles.map(({ article, isSubmitting }, index) => (
        <ArticlePreview
          key={article.slug}
          article={article}
          isSubmitting={isSubmitting}
          onFavoriteToggle={isSubmitting ? undefined : onFavoriteToggle(index, article)}
        />
      )),
  });
}

function onFavoriteToggle(index: number, { slug, favorited }: Article) {
  return async () => {
    if (store.getState().app.user.isNone()) {
      location.hash = '#/login';
      return;
    }
    store.dispatch(startSubmittingFavorite(index));

    const article = await (favorited ? unfavoriteArticle(slug) : favoriteArticle(slug));
    store.dispatch(endSubmittingFavorite({ index, article }));
  };
}
