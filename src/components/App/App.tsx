import axios from 'axios';
import { Fragment } from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import { getUser } from '../../services/conduit';
import { store } from '../../state/store';
import { useStoreWithInitializer } from '../../state/storeHooks';
import { EditArticle } from '../Pages/EditArticle/EditArticle';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import { Home } from '../Pages/Home/Home';
import { Login } from '../Pages/Login/Login';
import { NewArticle } from '../Pages/NewArticle/NewArticle';
import { Register } from '../Pages/Register/Register';
import { Settings } from '../Pages/Settings/Settings';
import { endLoad, loadUser } from './App.slice';

export function App() {
  const { loading, user } = useStoreWithInitializer(({ app }) => app, load);

  const userIsLogged = user.isSome();

  return (
    <HashRouter>
      {!loading && (
        <Fragment>
          <Header />
          <Switch>
            <Route exact path='/login'>
              <Login />
              {userIsLogged && <Redirect to='/' />}
            </Route>
            <Route exact path='/register'>
              <Register />
              {userIsLogged && <Redirect to='/' />}
            </Route>
            <Route exact path='/settings'>
              <Settings />
              {!userIsLogged && <Redirect to='/' />}
            </Route>
            <Route exact path='/editor'>
              <NewArticle />
              {!userIsLogged && <Redirect to='/' />}
            </Route>
            <Route exact path='/editor/:slug'>
              <EditArticle />
              {!userIsLogged && <Redirect to='/' />}
            </Route>
            <Route exact path='/'>
              <Home />
            </Route>
            <Route path='*'>
              <Redirect to='/' />
            </Route>
          </Switch>
          <Footer />
        </Fragment>
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

  try {
    store.dispatch(loadUser(await getUser()));
  } catch {
    store.dispatch(endLoad());
  }
}
