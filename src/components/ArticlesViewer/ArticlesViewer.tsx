import { Fragment } from 'react';
import { favoriteArticle, unfavoriteArticle } from '../../services/conduit';
import { store } from '../../state/store';
import { useStore } from '../../state/storeHooks';
import { Article } from '../../types/article';
import { classObjectToClassName } from '../../types/style';
import { ArticlePreview } from '../ArticlePreview/ArticlePreview';
import { Pagination } from '../Pagination/Pagination';
import { ArticleViewerState, endSubmittingFavorite, startSubmittingFavorite } from './ArticlesViewer.slice';

export function ArticlesViewer({
  toggleClassName,
  tabs,
  selectedTab,
  onPageChange,
  onTabChange,
}: {
  toggleClassName: string;
  tabs: string[];
  selectedTab: string;
  onPageChange?: (index: number) => void;
  onTabChange?: (tab: string) => void;
}) {
  const { articles, articlesCount, currentPage } = useStore(({ articleViewer }) => articleViewer);

  return (
    <Fragment>
      <ArticlesTabSet {...{ tabs, selectedTab, toggleClassName, onTabChange }} />
      <ArticleList articles={articles} />
      <Pagination currentPage={currentPage} count={articlesCount} itemsPerPage={10} onPageChange={onPageChange} />
    </Fragment>
  );
}

function ArticlesTabSet({
  tabs,
  toggleClassName,
  selectedTab,
  onTabChange,
}: {
  tabs: string[];
  toggleClassName: string;
  selectedTab: string;
  onTabChange?: (tab: string) => void;
}) {
  return (
    <div className={toggleClassName}>
      <ul className='nav nav-pills outline-active'>
        {tabs.map((tab) => (
          <li key={tab} className='nav-item'>
            <a
              className={classObjectToClassName({ 'nav-link': true, active: tab === selectedTab })}
              href='#'
              onClick={(ev) => {
                ev.preventDefault();
                onTabChange && onTabChange(tab);
              }}
            >
              {tab}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ArticleList({ articles }: { articles: ArticleViewerState['articles'] }) {
  return articles.match({
    none: () => (
      <div className='article-preview' key={1}>
        Loading articles...
      </div>
    ),
    some: (articles) => (
      <Fragment>
        {articles.map(({ article, isSubmitting }, index) => (
          <ArticlePreview
            key={article.slug}
            article={article}
            isSubmitting={isSubmitting}
            onFavoriteToggle={isSubmitting ? undefined : onFavoriteToggle(index, article)}
          />
        ))}
      </Fragment>
    ),
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
