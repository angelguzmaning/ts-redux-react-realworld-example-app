import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { followUser, getArticles, getProfile, unfollowUser } from '../../../services/conduit';
import { store } from '../../../state/store';
import { Profile } from '../../../types/profile';
import { initialize, loadUser } from '../../App/App.slice';
import { ProfilePage } from './ProfilePage';

jest.mock('../../../services/conduit.ts');

const mockedFollowUser = followUser as jest.Mock<ReturnType<typeof followUser>>;
const mockedUnfollowUser = unfollowUser as jest.Mock<ReturnType<typeof unfollowUser>>;
const mockedGetArticles = getArticles as jest.Mock<ReturnType<typeof getArticles>>;
mockedGetArticles.mockResolvedValue({ articles: [], articlesCount: 0 });

const defaultProfile: Profile = {
  username: '',
  bio: '',
  image: null,
  following: false,
};
const mockedGetProfile = getProfile as jest.Mock<ReturnType<typeof getProfile>>;
mockedGetProfile.mockResolvedValue(defaultProfile);

beforeEach(async () => {
  await act(async () => {
    store.dispatch(
      loadUser({
        email: 'jake@jake.jake',
        token: 'jwt.token.here',
        username: 'jake',
        bio: 'I work at statefarm',
        image: null,
      })
    );
  });
});

async function renderWithPath(profile: string) {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/${profile}`]}>
        <Route path='/:profile'>
          <ProfilePage />
        </Route>
      </MemoryRouter>
    );
  });
}

it('Should return to homepage if get profile fails', async () => {
  location.hash = '#/profile/something';
  mockedGetProfile.mockRejectedValueOnce({});

  await act(async () => {
    await renderWithPath('something');
  });

  expect(location.hash === '#/').toBeTruthy();
});

it('Should load profile', async () => {
  location.hash = '#/profile/something';
  mockedGetProfile.mockResolvedValueOnce({
    ...defaultProfile,
    username: 'The Jake',
    bio: 'The Great',
  });

  await act(async () => {
    await renderWithPath('something');
  });

  expect(location.hash === '#/profile/something').toBeTruthy();
  expect(screen.getByText('The Jake')).toBeInTheDocument();
  expect(screen.getByText('The Great')).toBeInTheDocument();
});

it('Should go to sign up page if a guest tries to follow', async () => {
  location.hash = '#/profile/something';
  mockedGetProfile.mockResolvedValueOnce({
    ...defaultProfile,
    username: 'The Jake',
    bio: 'The Great',
  });

  await act(async () => {
    store.dispatch(initialize());
    await renderWithPath('something');
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Follow The Jake'));
  });

  expect(location.hash === '#/register').toBeTruthy();
});

it('Should follow user', async () => {
  mockedGetProfile.mockResolvedValueOnce({
    ...defaultProfile,
    username: 'The Jake',
    bio: 'The Great',
  });
  mockedFollowUser.mockResolvedValueOnce({ ...defaultProfile, following: true });

  await act(async () => {
    await renderWithPath('something');
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Follow The Jake'));
  });

  expect(mockedFollowUser.mock.calls).toHaveLength(1);
  expect(mockedFollowUser.mock.calls[0][0] === 'The Jake').toBeTruthy();
  expect(store.getState().profile.profile.unwrap().following).toBeTruthy();
});

it('Should unfollow user', async () => {
  mockedGetProfile.mockResolvedValueOnce({
    ...defaultProfile,
    username: 'The Jake',
    bio: 'The Great',
    following: true,
  });
  mockedUnfollowUser.mockResolvedValueOnce({ ...defaultProfile, following: false });

  await act(async () => {
    await renderWithPath('something');
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Unfollow The Jake'));
  });

  expect(mockedUnfollowUser.mock.calls).toHaveLength(1);
  expect(mockedUnfollowUser.mock.calls[0][0] === 'The Jake').toBeTruthy();
  expect(store.getState().profile.profile.unwrap().following).toBeFalsy();
});

it('Should redirect to settings on Edit Profile Settings when the profile is for the logged user', async () => {
  location.hash = '#/profile/something';
  mockedGetProfile.mockResolvedValueOnce({
    ...defaultProfile,
    username: 'jake',
    bio: 'The Great',
    following: true,
  });

  await act(async () => {
    await renderWithPath('something');
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Edit Profile Settings'));
  });

  expect(location.hash === '#/settings').toBeTruthy();
});
