import { useParams } from 'react-router-dom';
import { followUser, getProfile, unfollowUser } from '../../../services/conduit';
import { store } from '../../../state/store';
import { useStoreWithInitializer } from '../../../state/storeHooks';
import { redirect } from '../../../types/location';
import { Profile } from '../../../types/profile';
import { UserInfo } from '../../UserInfo/UserInfo';
import { initializeProfile, loadProfile, startSubmitting } from './ProfilePage.slice';

export function ProfilePage() {
  const { username } = useParams<{ username: string }>();

  const { profile, submitting } = useStoreWithInitializer(
    ({ profile }) => profile,
    () => onLoad(username)
  );

  return profile.match({
    none: () => (
      <div className='article-preview' key={1}>
        Loading profile...
      </div>
    ),
    some: (profile) => (
      <div className='profile-page'>
        <UserInfo
          user={profile}
          disabled={submitting}
          onFollowToggle={onFollowToggle(profile)}
          onEditSettings={() => redirect('settings')}
        />

        <div className='container'>
          <div className='row'>
            <div className='col-xs-12 col-md-10 offset-md-1'></div>
          </div>
        </div>
      </div>
    ),
  });
}

async function onLoad(username: string) {
  store.dispatch(initializeProfile());
  try {
    const profile = await getProfile(username);
    store.dispatch(loadProfile(profile));
  } catch {
    location.href = '#/';
  }
}

function onFollowToggle(profile: Profile): () => void {
  return async () => {
    const { user } = store.getState().app;
    if (user.isNone()) {
      redirect('register');
      return;
    }

    store.dispatch(startSubmitting());

    const newProfile = await (profile.following ? unfollowUser : followUser)(profile.username);
    store.dispatch(loadProfile(newProfile));
  };
}
