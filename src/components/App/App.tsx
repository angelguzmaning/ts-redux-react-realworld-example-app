import axios from 'axios';
import { useEffect } from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import { getUser } from '../../services/conduit';
import { store } from '../../state/store';
import { Home } from '../Home/Home';
import { Login } from '../Login/Login';
import { loadUser } from './App.slice';

export function App() {
  useEffect(() => {
    loadUserIfItIsLogged();
  }, [null]);

  return (
    <HashRouter>
      <Switch>
        <Route exact path='/login'>
          <Login />
        </Route>
        <Route exact path='/'>
          <Home />
        </Route>
        <Route path='*'>
          <Redirect to='/' />
        </Route>
      </Switch>
    </HashRouter>
  );
}

async function loadUserIfItIsLogged() {
  const token = localStorage.getItem('token');
  if (store.getState().app.user.isNone() && token) {
    axios.defaults.headers.Authorization = `Token ${token}`;
    store.dispatch(loadUser(await getUser()));
  }
}
