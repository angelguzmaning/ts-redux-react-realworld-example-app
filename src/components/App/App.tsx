import axios from 'axios';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import { getUser } from '../../services/conduit';
import { store } from '../../state/store';
import { useStoreWithInitializer } from '../../state/storeHooks';
import { Home } from '../Home/Home';
import { Login } from '../Login/Login';
import { Settings } from '../Settings/Settings';
import { endLoad, loadUser } from './App.slice';

export function App() {
  const { loading, user } = useStoreWithInitializer(({ app }) => app, load);

  const userIsLogged = user.isSome();

  return (
    <HashRouter>
      {!loading && (
        <Switch>
          <Route exact path='/login'>
            <Login />
            {userIsLogged && <Redirect to='/' />}
          </Route>
          <Route exact path='/settings'>
            <Settings />
            {!userIsLogged && <Redirect to='/' />}
          </Route>
          <Route exact path='/'>
            <Home />
          </Route>
          <Route path='*'>
            <Redirect to='/' />
          </Route>
        </Switch>
      )}
    </HashRouter>
  );
}

async function load() {
  const token = localStorage.getItem('token');
  if (!store.getState().app.loading || !token) {
    store.dispatch(endLoad());
    return;
  }
  axios.defaults.headers.Authorization = `Token ${token}`;
  store.dispatch(loadUser(await getUser()));
}
