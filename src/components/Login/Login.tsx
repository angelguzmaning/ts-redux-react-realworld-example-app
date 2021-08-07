import axios from 'axios';
import React from 'react';
import { login } from '../../services/conduit';
import { dispatchOnCall, store } from '../../state/store';
import { useStoreWithInitializer } from '../../state/storeHooks';
import { LoginError } from '../../types/login';
import { loadUser } from '../App/App.slice';
import { FormGroup } from '../FormGroup/FormGroup';
import { initialize, startLoginIn, updateEmail, updateErrors, updatePassword } from './Login.slice';

export function Login() {
  const { errors, loginIn, email, password } = useStoreWithInitializer(
    ({ login }) => login,
    dispatchOnCall(initialize())
  );

  return (
    <div className='auth-page'>
      <div className='container page'>
        <div className='row'>
          <div className='col-md-6 offset-md-3 col-xs-12'>
            <h1 className='text-xs-center'>Sign in</h1>
            <p className='text-xs-center'>
              <a href='/#/register'>Need an account?</a>
            </p>

            {renderErrors(errors)}

            <form onSubmit={signIn}>
              <FormGroup type='text' placeholder='Email' onChange={_updateEmail} disabled={loginIn} value={email} />
              <FormGroup
                type='password'
                placeholder='Password'
                onChange={_updatePassword}
                disabled={loginIn}
                value={password}
              />
              <button className='btn btn-lg btn-primary pull-xs-right' type='submit'>
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderErrors(errors: LoginError) {
  return (
    <ul className='error-messages'>
      {Object.entries(errors).map(([field, fieldErrors]) =>
        fieldErrors.map((fieldError) => (
          <li key={field + fieldError}>
            {field} {fieldError}
          </li>
        ))
      )}
    </ul>
  );
}

function _updateEmail(ev: React.ChangeEvent<HTMLInputElement>) {
  store.dispatch(updateEmail(ev.currentTarget.value));
}

function _updatePassword(ev: React.ChangeEvent<HTMLInputElement>) {
  store.dispatch(updatePassword(ev.currentTarget.value));
}

async function signIn(ev: React.FormEvent) {
  ev.preventDefault();

  if (store.getState().login.loginIn) return;
  store.dispatch(startLoginIn());

  const { email, password } = store.getState().login;
  const result = await login(email, password);

  result.match({
    ok: (user) => {
      location.hash = '#/';
      localStorage.setItem('token', user.token);
      axios.defaults.headers.Authorization = `Token ${user.token}`;
      store.dispatch(loadUser(user));
    },
    err: (e) => {
      store.dispatch(updateErrors(e));
    },
  });
}
