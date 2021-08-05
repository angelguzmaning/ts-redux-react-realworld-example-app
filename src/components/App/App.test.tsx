import { act, render, screen } from '@testing-library/react';
import { getArticles, getTags } from '../../services/conduit';
import { MultipleArticles } from '../../types/article';
import { App } from './App';

jest.mock('../../services/conduit', () => ({
  getArticles: jest.fn((): MultipleArticles => ({ articles: [], articlesCount: 0 })),
  getTags: jest.fn((): { tags: string[] } => ({ tags: [] })),
}));

const mockedGetArticles = getArticles as jest.Mock<ReturnType<typeof getArticles>>;
const mockedGetTags = getTags as jest.Mock<ReturnType<typeof getTags>>;

it('Should render home', async () => {
  mockedGetArticles.mockImplementationOnce(async () => ({
    articles: [],
    articlesCount: 0,
  }));
  mockedGetTags.mockImplementationOnce(async () => ({ tags: [] }));

  await act(async () => {
    await render(<App />);
  });

  expect(screen.getByText('A place to share your knowledge.')).toBeInTheDocument();
});
