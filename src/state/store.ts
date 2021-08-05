import { configureStore } from '@reduxjs/toolkit';
import home from '../components/Home/Home.slice';

const middlewareConfiguration = { serializableCheck: false };

export const store = configureStore({
  reducer: { home },
  devTools: {
    name: 'Conduit',
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(middlewareConfiguration),
});
export type State = ReturnType<typeof store.getState>;
