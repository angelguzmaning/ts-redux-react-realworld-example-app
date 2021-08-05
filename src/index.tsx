import ReactDOM from 'react-dom';
import './index.css';
import { App } from './components/App/App';
import { Fragment } from 'react';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';

ReactDOM.render(
  <Fragment>
    <Header />
    <App />
    <Footer />
  </Fragment>,
  document.getElementById('root')
);
