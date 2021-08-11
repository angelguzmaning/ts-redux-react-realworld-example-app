import { Option } from '@hqoss/monads';
import { getArticles, getTags } from '../../../services/conduit';
import { store } from '../../../state/store';
import { useStoreWithInitializer } from '../../../state/storeHooks';
import { ArticlesViewer } from '../../ArticlesViewer/ArticlesViewer';
import { changePage, loadArticles, startLoadingArticles } from '../../ArticlesViewer/ArticlesViewer.slice';
import { loadTags, startLoadingTags } from './Home.slice';

export function Home() {
  const { tags } = useStoreWithInitializer(({ home }) => home, load);

  return (
    <div className='home-page'>
      {renderBanner()}
      <div className='container page'>
        <div className='row'>
          <div className='col-md-9'>
            <ArticlesViewer
              toggleClassName='feed-toggle'
              selectedTab='Global Feed'
              tabs={['Global Feed']}
              onPageChange={onPageChange}
            />
          </div>

          <div className='col-md-3'>{renderSidebar(tags)}</div>
        </div>
      </div>
    </div>
  );
}

async function load() {
  store.dispatch(startLoadingArticles());
  store.dispatch(startLoadingTags());

  const multipleArticles = await getArticles();
  store.dispatch(loadArticles(multipleArticles));

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

async function onPageChange(index: number) {
  store.dispatch(changePage(index));

  const multipleArticles = await getArticles({ offset: (index - 1) * 10 });
  store.dispatch(loadArticles(multipleArticles));
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
