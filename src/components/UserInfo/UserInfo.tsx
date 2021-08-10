import { useStore } from '../../state/storeHooks';
import { Profile } from '../../types/profile';

export function UserInfo({
  user: { image, username, bio, following },
  onFollowToggle,
  onEditSettings,
}: {
  user: Profile;
  onFollowToggle?: () => void;
  onEditSettings?: () => void;
}) {
  const { user } = useStore(({ app }) => app);
  const sessionUsername = user.map((x) => x.username).unwrapOr('');

  return (
    <div className='user-info'>
      <div className='container'>
        <div className='row'>
          <div className='col-xs-12 col-md-10 offset-md-1'>
            <img src={image || undefined} className='user-img' />
            <h4>{username}</h4>
            <p>{bio}</p>

            {sessionUsername === username ? (
              <EditProfileButton onClick={onEditSettings} />
            ) : (
              <ToggleFollowButton following={following} username={username} onClick={onFollowToggle} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleFollowButton({
  following,
  username,
  onClick,
}: {
  following: boolean;
  username: string;

  onClick?: () => void;
}) {
  return (
    <button className='btn btn-sm btn-outline-secondary action-btn' onClick={onClick}>
      <i className='ion-plus-round'></i>
      {following ? 'Unfollow' : 'Follow'} {username}
    </button>
  );
}

function EditProfileButton({ onClick }: { onClick?: () => void }) {
  return (
    <button className='btn btn-sm btn-outline-secondary action-btn' onClick={onClick}>
      <i className='ion-gear-a'></i>Edit Profile Settings
    </button>
  );
}
