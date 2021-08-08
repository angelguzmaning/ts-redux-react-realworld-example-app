import { format } from 'date-fns';
import { Article } from '../../types/article';

export function ArticlePreview({
  article: {
    createdAt,
    favorited,
    favoritesCount,
    slug,
    title,
    description,
    tagList,
    author: { image, username },
  },
  isSubmitting,
  onFavoriteToggle,
}: {
  article: Article;
  isSubmitting: boolean;
  onFavoriteToggle?: () => void;
}) {
  return (
    <div className='article-preview'>
      <div className='article-meta'>
        <a href='profile.html'>
          <img src={image || undefined} />
        </a>
        <div className='info'>
          <a href={`/#/@${username}`} className='author'>
            {username}
          </a>
          <span className='date'>{format(createdAt, 'PP')}</span>
        </div>
        <button
          className={`btn btn-sm pull-xs-right ${favorited ? 'btn-primary' : 'btn-outline-primary'}`}
          disabled={isSubmitting}
          onClick={onFavoriteToggle}
        >
          <i className='ion-heart'></i> {favoritesCount}
        </button>
      </div>
      <a href={`/#/article/${slug}`} className='preview-link'>
        <h1>{title}</h1>
        <p>{description}</p>
        <span>Read more...</span>
        <TagList tagList={tagList} />
      </a>
    </div>
  );
}

function TagList({ tagList }: { tagList: string[] }) {
  return (
    <ul className='tag-list'>
      {tagList.map((tag) => (
        <li key={tag} className='tag-default tag-pill tag-outline'>
          {tag}
        </li>
      ))}
    </ul>
  );
}
