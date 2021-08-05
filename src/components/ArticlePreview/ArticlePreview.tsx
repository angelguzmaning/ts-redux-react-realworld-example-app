import { format } from 'date-fns';
import { Article } from '../../types/article';

export function ArticlePreview({
  article: {
    createdAt,
    favoritesCount,
    slug,
    title,
    description,
    author: { image, username },
  },
}: {
  article: Article;
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
        <button className='btn btn-outline-primary btn-sm pull-xs-right'>
          <i className='ion-heart'></i> {favoritesCount}
        </button>
      </div>
      <a href={`/#/article/${slug}`} className='preview-link'>
        <h1>{title}</h1>
        <p>{description}</p>
        <span>Read more...</span>
      </a>
    </div>
  );
}
