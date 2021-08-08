import { Option } from '@hqoss/monads';
import { favoriteArticle, getArticles, getTags, unfavoriteArticle } from '../../services/conduit';
import { store } from '../../state/store';
import { useStoreWithInitializer } from '../../state/storeHooks';
import { Article } from '../../types/article';
import { ArticlePreview } from '../ArticlePreview/ArticlePreview';
import {
  endSubmittingFavorite,
  HomeState,
  loadArticles,
  loadTags,
  startLoading,
  startSubmittingFavorite,
} from './Home.slice';

export function Home() {
  const { articles, tags } = useStoreWithInitializer(({ home }) => home, load);

  return (
    <div className='home-page'>
      {renderBanner()}
      <div className='container page'>
        <div className='row'>
          <div className='col-md-9'>
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
          </div>

          <div className='col-md-3'>{renderSidebar(tags)}</div>
        </div>
      </div>
    </div>
  );
}

async function load() {
  store.dispatch(startLoading());

  const multipleArticles = await getArticles();
  store.dispatch(loadArticles(multipleArticles.articles));

  const tagsResult = await getTags();
  store.dispatch(loadTags(tagsResult.tags));
}

function renderBanner() {
  return (
    <div className='banner'>
      <div className='container'>
        <h1 className='logo-font'>conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>
  );
}

function renderArticles(articles: HomeState['articles']) {
  return articles.match({
    none: () => [<span key={1}>Loading articles...</span>],
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

function renderSidebar(tags: Option<string[]>) {
  return (
    <div className='sidebar'>
      <p>Popular Tags</p>

      {tags.match({
        none: () => <span>Loading tags...</span>,
        some: (tags) => (
          <div className='tag-list'>
            {' '}
            {tags.map((tag) => (
              <a key={tag} href='' className='tag-pill tag-default'>
                {tag}
              </a>
            ))}{' '}
          </div>
        ),
      })}
    </div>
  );
}
