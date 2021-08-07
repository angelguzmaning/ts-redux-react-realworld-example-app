import { useEffect, useState } from 'react';
import { State, store } from './store';

export function useStoreWithInitializer<T>(getter: (state: State) => T, initializer: () => unknown) {
  const [state, setState] = useState(getter(store.getState()));
  useEffect(() => {
    const unsubscribe = store.subscribe(() => setState(getter(store.getState())));
    initializer();
    return unsubscribe;
  }, [null]);
  return state;
}
