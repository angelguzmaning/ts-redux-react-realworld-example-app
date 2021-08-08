import { Action, configureStore } from '@reduxjs/toolkit';
import home from '../components/Home/Home.slice';
import login from '../components/Login/Login.slice';
import app from '../components/App/App.slice';
import settings from '../components/Settings/Settings.slice';
import register from '../components/Register/Register.slice';

const middlewareConfiguration = { serializableCheck: false };

export const store = configureStore({
  reducer: { home, login, app, settings, register },
  devTools: {
    name: 'Conduit',
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(middlewareConfiguration),
});
export type State = ReturnType<typeof store.getState>;

export function dispatchOnCall(action: Action) {
  return () => store.dispatch(action);
}
