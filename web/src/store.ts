import { applyMiddleware, createStore } from 'redux';
import ReduxPromisse from 'redux-promise'
import { composeWithDevTools } from 'redux-devtools-extension';

import reducers from './reducers'

const store = createStore(reducers, composeWithDevTools(
  applyMiddleware(ReduxPromisse)
));

export default store;