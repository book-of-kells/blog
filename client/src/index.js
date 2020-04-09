import React from 'react';
import { createBrowserHistory } from 'history';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch, Router } from 'react-router-dom';

import store from './store';
import { App } from './components';

import '../resources/scss/style.scss';


ReactDOM.render(
  <Router history={createBrowserHistory()}>
    <Provider store={store}>
      <App />
      {/*<Switch>
        <Route path="/" component={App} />
      </Switch> */}
    </Provider>
  </Router>,
  document.getElementById('root'),
);