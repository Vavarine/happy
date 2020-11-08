import { combineReducers } from 'redux';

import { userReducer, UserState } from './userReducer';

export interface Reducers {
  user: UserState;
}

const reducers = combineReducers({
  user: userReducer
});

export default reducers