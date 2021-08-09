import React from 'react';
import { login } from '../../services/conduit';
import { dispatchOnCall, store } from '../../state/store';
import { useStoreWithInitializer } from '../../state/storeHooks';
import { loadUserIntoApp } from '../../types/user';
import { buildGenericFormField } from '../../types/genericFormField';
import { GenericForm } from '../GenericForm/GenericForm';
import { initialize, LoginState, startLoginIn, updateErrors, updateField } from './Login.slice';

export function Login() {
  const { errors, loginIn, user } = useStoreWithInitializer(({ login }) => login, dispatchOnCall(initialize()));

  return (
    <div className='auth-page'>
      <div className='container page'>
        <div className='row'>
          <div className='col-md-6 offset-md-3 col-xs-12'>
            <h1 className='text-xs-center'>Sign in</h1>
            <p className='text-xs-center'>
              <a href='/#/register'>Need an account?</a>
            </p>

            <GenericForm
              disabled={loginIn}
              formObject={user}
              submitButtonText='Sign in'
              errors={errors}
              onChange={onUpdateField}
              onSubmit={signIn}
              fields={[
                buildGenericFormField({ name: 'email', placeholder: 'Email' }),
                buildGenericFormField({ name: 'password', placeholder: 'Password', type: 'password' }),
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function onUpdateField(name: string, value: string) {
  store.dispatch(updateField({ name: name as keyof LoginState['user'], value }));
}

async function signIn(ev: React.FormEvent) {
  ev.preventDefault();

  if (store.getState().login.loginIn) return;
  store.dispatch(startLoginIn());

  const { email, password } = store.getState().login.user;
  const result = await login(email, password);

  result.match({
    ok: (user) => {
      location.hash = '#/';
      loadUserIntoApp(user);
    },
    err: (e) => {
      store.dispatch(updateErrors(e));
    },
  });
}
