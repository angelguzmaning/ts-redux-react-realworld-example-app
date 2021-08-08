import { dispatchOnCall, store } from '../../state/store';
import { useStoreWithInitializer } from '../../state/storeHooks';
import { buildUserFormField } from '../../types/userFormField';
import { UserForm } from '../UserForm/UserForm';
import { initialize, RegisterState, startSigningUp, updateErrors, updateField } from './Register.slice';
import { loadUserIntoApp, UserForRegistration } from '../../types/user';
import { signUp } from '../../services/conduit';

export function Register() {
  const { errors, signingUp, user } = useStoreWithInitializer(({ register }) => register, dispatchOnCall(initialize()));

  return (
    <div className='auth-page'>
      <div className='container page'>
        <div className='row'>
          <div className='col-md-6 offset-md-3 col-xs-12'>
            <h1 className='text-xs-center'>Sign up</h1>
            <p className='text-xs-center'>
              <a href='/#/login'>Have an account?</a>
            </p>

            <UserForm
              disabled={signingUp}
              formObject={user as unknown as Record<string, string>}
              submitButtonText='Sign up'
              errors={errors}
              onChange={_updateField}
              onSubmit={_signUp(user)}
              fields={[
                buildUserFormField({ name: 'username', placeholder: 'Username' }),
                buildUserFormField({ name: 'email', placeholder: 'Email' }),
                buildUserFormField({ name: 'password', placeholder: 'Password', type: 'password' }),
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function _updateField(name: string, value: string) {
  store.dispatch(updateField({ name: name as keyof RegisterState['user'], value }));
}

function _signUp(user: UserForRegistration) {
  return async (ev: React.FormEvent) => {
    ev.preventDefault();
    store.dispatch(startSigningUp());
    const result = await signUp(user);

    result.match({
      err: (e) => store.dispatch(updateErrors(e)),
      ok: (user) => {
        location.hash = '#/';
        loadUserIntoApp(user);
      },
    });
  };
}
