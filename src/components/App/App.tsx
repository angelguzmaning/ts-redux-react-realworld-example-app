import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Home } from '../Home/Home';
import { Login } from '../Login/Login';

export function App() {
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
