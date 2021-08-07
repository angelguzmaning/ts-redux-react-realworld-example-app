import { act, fireEvent, render, screen } from '@testing-library/react';
import { favoriteArticle, getArticles, getTags, unfavoriteArticle } from '../../services/conduit';
import { store } from '../../state/store';
import { MultipleArticles } from '../../types/article';
import { Home } from './Home';

jest.mock('../../services/conduit', () => ({
  getArticles: jest.fn((): MultipleArticles => ({ articles: [], articlesCount: 0 })),
  getTags: jest.fn((): { tags: string[] } => ({ tags: [] })),
  favoriteArticle: jest.fn(),
  unfavoriteArticle: jest.fn(),
}));

const mockedGetArticles = getArticles as jest.Mock<ReturnType<typeof getArticles>>;
const mockedGetTags = getTags as jest.Mock<ReturnType<typeof getTags>>;
const mockedFavoriteArticle = favoriteArticle as jest.Mock<ReturnType<typeof favoriteArticle>>;
const mockedUnfavoriteArticle = unfavoriteArticle as jest.Mock<ReturnType<typeof unfavoriteArticle>>;

const defaultArticle = {
  author: {
    bio: null,
    following: false,
    image: 'https://static.productionready.io/images/smiley-cyrus.jpg',
    username: 'Jazmin Martinez',
  },
  body: 'Test 1',
  createdAt: new Date(),
  description: 'Test 1',
  favorited: false,
  favoritesCount: 0,
  slug: 'test-pmy91z',
  tagList: [],
  title: 'Test',
  updatedAt: new Date(),
};

it('Should load articles', async () => {
  mockedGetArticles.mockImplementationOnce(async () => ({
    articles: [
      defaultArticle,
      {
        ...defaultArticle,
        description: 'Test 2',
        slug: 'test-2344',
        author: { ...defaultArticle.author, image: null },
      },
    ],
    articlesCount: 0,
  }));
  mockedGetTags.mockImplementationOnce(async () => ({ tags: ['twitter', 'facebook', 'google'] }));

  await act(async () => {
    await render(<Home />);
  });

  screen.getByText('google');
  screen.getByText('Test 1');
  screen.getByText('Test 2');
});

it('Should favorite article', async () => {
  mockedGetArticles.mockImplementationOnce(async () => ({
    articles: [defaultArticle],
    articlesCount: 0,
  }));
  mockedGetTags.mockImplementationOnce(async () => ({ tags: [] }));
  mockedFavoriteArticle.mockResolvedValueOnce({ ...defaultArticle, favorited: true });

  await act(async () => {
    await render(<Home />);
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button'));
    expect(store.getState().home.articles.unwrap()[0].isSubmitting).toBe(true);
  });

  expect(store.getState().home.articles.unwrap()[0].isSubmitting).toBe(false);
  expect(store.getState().home.articles.unwrap()[0].article.favorited).toBe(true);
});

it('Should unfavorite article', async () => {
  mockedGetArticles.mockImplementationOnce(async () => ({
    articles: [{ ...defaultArticle, favorited: true }],
    articlesCount: 0,
  }));
  mockedGetTags.mockImplementationOnce(async () => ({ tags: [] }));
  mockedUnfavoriteArticle.mockResolvedValueOnce({ ...defaultArticle, favorited: false });

  await act(async () => {
    await render(<Home />);
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button'));
    expect(store.getState().home.articles.unwrap()[0].isSubmitting).toBe(true);
  });

  expect(store.getState().home.articles.unwrap()[0].isSubmitting).toBe(false);
  expect(store.getState().home.articles.unwrap()[0].article.favorited).toBe(false);
});
