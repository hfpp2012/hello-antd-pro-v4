import React from 'react';
import ReactDOM from 'react-dom';
import NavigationBar from './components/NavigationBar';
import FlashMessagesList from './components/flash/FlashMessagesList';
import registerServiceWorker from './registerServiceWorker';

import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { BrowserRouter as Router } from 'react-router-dom';
import routes from './routes';

import { createStore, applyMiddleware } from 'redux';

import rootReducer from './reducers';

import { Provider } from 'react-redux';

import jwtDecode from 'jwt-decode';

import setAuthorizationToken from './utils/setAuthorizationToken';
import { setCurrentUser } from './actions/authActions';

import axios from 'axios';

const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(thunk, logger)
  )
);

if (localStorage.jwtToken) {
  setAuthorizationToken(localStorage.jwtToken);
  store.dispatch(setCurrentUser(jwtDecode(localStorage.jwtToken)));
}

if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'https://redux-login.rails365.net';
}

ReactDOM.render(
  <Provider store={ store }>
    <Router routes={ routes }>
      <div>
        <NavigationBar />
        <FlashMessagesList />
        { routes }
      </div>
    </Router>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
