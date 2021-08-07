import axios from 'axios';
import React from 'react';
import { updateSettings } from '../../services/conduit';
import { store } from '../../state/store';
import { useStore } from '../../state/storeHooks';
import { UserSettings } from '../../types/user';
import { loadUser, logout } from '../App/App.slice';
import { Errors } from '../Errors/Errors';
import { FormGroup, TextAreaFormGroup } from '../FormGroup/FormGroup';
import { startUpdate, updateErrors, updateField } from './Settings.slice';

export interface SettingsField {
  name: keyof UserSettings;
  type?: string;
  isTextArea?: true;
  placeholder: string;
}

export function Settings() {
  const { user, errors, updating } = useStore(({ settings }) => settings);

  return (
    <div className='settings-page'>
      <div className='container page'>
        <div className='row'>
          <div className='col-md-6 offset-md-3 col-xs-12'>
            <h1 className='text-xs-center'>Your Settings</h1>

            <Errors errors={errors} />

            <form onSubmit={_updateSettings(user)}>
              <fieldset>
                <FormGroup
                  type='text'
                  placeholder='URL of profile picture'
                  disabled={updating}
                  value={user.image || ''}
                  onChange={_updateField('image')}
                />
                <FormGroup
                  type='text'
                  placeholder='Your Name'
                  disabled={updating}
                  value={user.username}
                  onChange={_updateField('username')}
                />
                <TextAreaFormGroup
                  type='text'
                  placeholder='Short bio about you'
                  disabled={updating}
                  value={user.bio || ''}
                  onChange={_updateField('bio')}
                  rows={8}
                />
                <FormGroup
                  type='text'
                  placeholder='Email'
                  disabled={updating}
                  value={user.email}
                  onChange={_updateField('email')}
                />
                <FormGroup
                  type='text'
                  placeholder='Password'
                  disabled={updating}
                  value={user.password || ''}
                  onChange={_updateField('password')}
                />
                <button className='btn btn-lg btn-primary pull-xs-right'>Update Settings</button>
              </fieldset>
            </form>

            <hr />
            <button className='btn btn-outline-danger' onClick={_logout}>
              Or click here to logout.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function _updateField(
  name: keyof UserSettings
): (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void {
  return ({ target: { value } }) => {
    store.dispatch(updateField({ name, value }));
  };
}

function _updateSettings(user: UserSettings) {
  return async (ev: React.FormEvent) => {
    ev.preventDefault();
    store.dispatch(startUpdate());
    const result = await updateSettings(user);

    result.match({
      err: (e) => store.dispatch(updateErrors(e)),
      ok: (user) => {
        store.dispatch(loadUser(user));
        location.hash = '/';
      },
    });
  };
}

function _logout() {
  delete axios.defaults.headers.Authorization;
  localStorage.removeItem('token');
  store.dispatch(logout());
  location.hash = '/';
}
