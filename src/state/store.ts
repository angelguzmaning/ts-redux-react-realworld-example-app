import { Action, configureStore } from '@reduxjs/toolkit';
import home from '../components/Home/Home.slice';
import login from '../components/Login/Login.slice';
import app from '../components/App/App.slice';

const middlewareConfiguration = { serializableCheck: false };

export const store = configureStore({
  reducer: { home, login, app },
  devTools: {
    name: 'Conduit',
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(middlewareConfiguration),
});
export type State = ReturnType<typeof store.getState>;

export function dispatchOnCall(action: Action) {
  return () => store.dispatch(action);
}
