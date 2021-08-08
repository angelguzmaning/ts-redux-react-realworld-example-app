import axios from 'axios';
import React from 'react';
import { updateSettings } from '../../services/conduit';
import { store } from '../../state/store';
import { useStore } from '../../state/storeHooks';
import { UserSettings } from '../../types/user';
import { buildUserFormField } from '../../types/userFormField';
import { loadUser, logout } from '../App/App.slice';
import { UserForm } from '../UserForm/UserForm';
import { SettingsState, startUpdate, updateErrors, updateField } from './Settings.slice';

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

            <UserForm
              disabled={updating}
              formObject={{ ...user }}
              submitButtonText='Update Settings'
              errors={errors}
              onChange={_updateField}
              onSubmit={_updateSettings(user)}
              fields={[
                buildUserFormField({ name: 'image', placeholder: 'URL of profile picture' }),
                buildUserFormField({ name: 'username', placeholder: 'Your Name' }),
                buildUserFormField({ name: 'bio', placeholder: 'Short bio about you', rows: 8, fieldType: 'texarea' }),
                buildUserFormField({ name: 'email', placeholder: 'Email' }),
                buildUserFormField({ name: 'password', placeholder: 'Password', type: 'password' }),
              ]}
            />

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

function _updateField(name: string, value: string) {
  store.dispatch(updateField({ name: name as keyof SettingsState['user'], value }));
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
