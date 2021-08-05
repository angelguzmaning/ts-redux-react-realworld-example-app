import { act, render, screen } from '@testing-library/react';
import { getArticles, getTags } from '../../services/conduit';
import { MultipleArticles } from '../../types/article';
import { Home } from './Home';

jest.mock('../../services/conduit', () => ({
  getArticles: jest.fn((): MultipleArticles => ({ articles: [], articlesCount: 0 })),
  getTags: jest.fn((): { tags: string[] } => ({ tags: [] })),
}));

const mockedGetArticles = getArticles as jest.Mock<ReturnType<typeof getArticles>>;
const mockedGetTags = getTags as jest.Mock<ReturnType<typeof getTags>>;

it('Should load articles', async () => {
  mockedGetArticles.mockImplementationOnce(async () => ({
    articles: [
      {
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
      },
      {
        author: {
          bio: null,
          following: false,
          image: null,
          username: 'Jazmin Martinez',
        },
        body: 'Test 2',
        createdAt: new Date(),
        description: 'Test 2',
        favorited: false,
        favoritesCount: 0,
        slug: 'test-pmy91zxx',
        tagList: [],
        title: 'Test',
        updatedAt: new Date(),
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
