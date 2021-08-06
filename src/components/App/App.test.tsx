import { act, render, screen } from '@testing-library/react';
import axios from 'axios';
import { getArticles, getTags, getUser } from '../../services/conduit';
import { store } from '../../state/store';
import { MultipleArticles } from '../../types/article';
import { App } from './App';

jest.mock('../../services/conduit', () => ({
  getArticles: jest.fn((): MultipleArticles => ({ articles: [], articlesCount: 0 })),
  getTags: jest.fn((): { tags: string[] } => ({ tags: [] })),
  getUser: jest.fn(),
}));

jest.mock('axios');

const mockedGetArticles = getArticles as jest.Mock<ReturnType<typeof getArticles>>;
const mockedGetTags = getTags as jest.Mock<ReturnType<typeof getTags>>;
const mockedGetUser = getUser as jest.Mock<ReturnType<typeof getUser>>;

it('Should render home', async () => {
  mockedGetArticles.mockImplementationOnce(async () => ({
    articles: [],
    articlesCount: 0,
  }));
  mockedGetTags.mockImplementationOnce(async () => ({ tags: [] }));
  mockedGetUser.mockImplementationOnce(jest.fn());
  localStorage.clear();

  await act(async () => {
    await render(<App />);
  });

  expect(screen.getByText('A place to share your knowledge.')).toBeInTheDocument();
  expect(mockedGetUser.mock.calls.length).toBe(0);
  mockedGetUser.mockClear();
});

it('Should get user if token is on storage', async () => {
  mockedGetUser.mockResolvedValueOnce({
    email: 'jake@jake.jake',
    token: 'my-token',
    username: 'jake',
    bio: 'I work at statefarm',
    image: null,
  });
  mockedGetArticles.mockImplementationOnce(async () => ({
    articles: [],
    articlesCount: 0,
  }));
  mockedGetTags.mockImplementationOnce(async () => ({ tags: [] }));
  localStorage.setItem('token', 'my-token');

  await act(async () => {
    await render(<App />);
  });

  expect(axios.defaults.headers.Authorization).toMatch('Token my-token');
  const optionUser = store.getState().app.user;
  expect(optionUser.isSome()).toBe(true);

  const user = optionUser.unwrap();
  expect(user).toHaveProperty('email', 'jake@jake.jake');
  expect(user).toHaveProperty('token', 'my-token');
});
