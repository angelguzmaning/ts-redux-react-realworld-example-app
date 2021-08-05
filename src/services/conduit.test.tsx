import axios, { AxiosStatic } from 'axios';
import { getArticles, getTags } from './conduit';

jest.mock('axios', () => {
  return {
    create: jest.fn(),
    post: jest.fn(() => {}),
    put: jest.fn(),
    defaults: {
      baseUrl: '',
      headers: {},
    },
    get: jest.fn(),
    delete: jest.fn(),
  };
});

const mockedAxios = axios as jest.Mocked<AxiosStatic>;

it('Should get articles', async () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: {
      articles: [
        {
          slug: 'how-to-train-your-dragon',
          title: 'How to train your dragon',
          description: 'Ever wonder how?',
          body: 'It takes a Jacobian',
          tagList: ['dragons', 'training'],
          createdAt: '2016-02-18T03:22:56.637Z',
          updatedAt: '2016-02-18T03:48:35.824Z',
          favorited: false,
          favoritesCount: 0,
          author: {
            username: 'jake',
            bio: 'I work at statefarm',
            image: 'https://i.stack.imgur.com/xHWG8.jpg',
            following: false,
          },
        },
        {
          slug: 'how-to-train-your-dragon-2',
          title: 'How to train your dragon 2',
          description: 'So toothless',
          body: 'It a dragon',
          tagList: ['dragons', 'training'],
          createdAt: '2016-02-18T03:22:56.637Z',
          updatedAt: '2016-02-18T03:48:35.824Z',
          favorited: false,
          favoritesCount: 0,
          author: {
            username: 'jake',
            bio: 'I work at statefarm',
            image: 'https://i.stack.imgur.com/xHWG8.jpg',
            following: false,
          },
        },
      ],
      articlesCount: 2,
    },
  });

  const result = await getArticles();
  expect(result.articles.length).toBe(2);
  expect(result.articlesCount).toBe(2);
});

it('Should get tags', async () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: {
      tags: ['reactjs', 'angularjs'],
    },
  });

  const result = await getTags();
  expect(result.tags.length).toBe(2);
  expect(result.tags).toContain('angularjs');
});
