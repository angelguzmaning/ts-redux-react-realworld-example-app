import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Home } from '../Home/Home';

export function App() {
  return (
    <HashRouter>
      <Switch>
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
