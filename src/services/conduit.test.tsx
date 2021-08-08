import axios, { AxiosStatic } from 'axios';
import {
  favoriteArticle,
  getArticles,
  getTags,
  getUser,
  login,
  signUp,
  unfavoriteArticle,
  updateSettings,
} from './conduit';

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

const defaultArticle = {
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
};
it('Should get articles', async () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: {
      articles: [
        defaultArticle,
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

it('Should send correct login object', async () => {
  mockedAxios.post.mockRejectedValueOnce({ data: { errors: { x: ['y', 'z'] } } });

  await login('thisIsUser', 'thisIsPassword');

  const call = mockedAxios.post.mock.calls[0];

  expect(call[1]).toHaveProperty('user');
  expect(call[1].user).toHaveProperty('email', 'thisIsUser');
  expect(call[1].user).toHaveProperty('password', 'thisIsPassword');
});

it('Should get login errors', async () => {
  mockedAxios.post.mockRejectedValueOnce({ data: { errors: { x: ['y', 'z'] } } });

  const result = await login('', '');
  result.match({
    ok: () => fail(),
    err: (e) => {
      expect(e).toHaveProperty('x');
      expect(e['x']).toHaveLength(2);
    },
  });
});

it('Should get user on successful login', async () => {
  mockedAxios.post.mockResolvedValueOnce({
    data: {
      user: {
        email: 'jake@jake.jake',
        token: 'jwt.token.here',
        username: 'jake',
        bio: 'I work at statefarm',
        image: null,
      },
    },
  });

  const result = await login('', '');
  result.match({
    ok: (user) => {
      expect(user).toHaveProperty('email', 'jake@jake.jake');
      expect(user).toHaveProperty('token', 'jwt.token.here');
    },
    err: () => fail(),
  });
});

it('Should return article on favorite', async () => {
  mockedAxios.post.mockResolvedValueOnce({
    data: {
      article: { ...defaultArticle, favorited: true },
    },
  });

  const result = await favoriteArticle(defaultArticle.slug);

  expect(mockedAxios.post.mock.calls.length).toBe(1);
  expect(result.slug).toMatch(defaultArticle.slug);
});

it('Should return article on unfavorite', async () => {
  mockedAxios.delete.mockResolvedValueOnce({
    data: {
      article: { ...defaultArticle, favorited: true },
    },
  });

  const result = await unfavoriteArticle(defaultArticle.slug);

  expect(mockedAxios.delete.mock.calls.length).toBe(1);
  expect(result.slug).toMatch(defaultArticle.slug);
});

it('Should get user', async () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: {
      user: {
        email: 'jake@jake.jake',
        token: 'jwt.token.here',
        username: 'jake',
        bio: 'I work at statefarm',
        image: null,
      },
    },
  });

  const user = await getUser();
  expect(user).toHaveProperty('email', 'jake@jake.jake');
  expect(user).toHaveProperty('token', 'jwt.token.here');
});

it('Should get update settings errors', async () => {
  mockedAxios.put.mockRejectedValueOnce({ data: { errors: { x: ['y', 'z'] } } });

  const result = await updateSettings({ email: '', password: '', bio: '', image: null, username: '' });
  result.match({
    ok: () => fail(),
    err: (e) => {
      expect(e).toHaveProperty('x');
      expect(e['x']).toHaveLength(2);
    },
  });
});

it('Should get user on successful settings update', async () => {
  mockedAxios.put.mockResolvedValueOnce({
    data: {
      user: {
        email: 'jake@jake.jake',
        token: 'jwt.token.here',
        username: 'jake',
        bio: 'I work at statefarm',
        image: null,
      },
    },
  });

  const result = await updateSettings({ email: '', password: '', bio: '', image: null, username: '' });
  result.match({
    ok: (user) => {
      expect(user).toHaveProperty('email', 'jake@jake.jake');
      expect(user).toHaveProperty('token', 'jwt.token.here');
    },
    err: () => fail(),
  });
});

it('Should get signUp errors', async () => {
  mockedAxios.post.mockRejectedValueOnce({ response: { data: { errors: { x: ['y', 'z'] } } } });

  const result = await signUp({ email: '', password: '', username: '' });
  result.match({
    ok: () => fail(),
    err: (e) => {
      expect(e).toHaveProperty('x');
      expect(e['x']).toHaveLength(2);
    },
  });
});

it('Should get user on successful signup', async () => {
  mockedAxios.post.mockResolvedValueOnce({
    data: {
      user: {
        email: 'jake@jake.jake',
        token: 'jwt.token.here',
        username: 'jake',
        bio: 'I work at statefarm',
        image: null,
      },
    },
  });

  const result = await signUp({ email: '', password: '', username: '' });
  result.match({
    ok: (user) => {
      expect(user).toHaveProperty('email', 'jake@jake.jake');
      expect(user).toHaveProperty('token', 'jwt.token.here');
    },
    err: () => fail(),
  });
});
