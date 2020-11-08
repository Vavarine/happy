import { UserAction } from "../actions";

export interface UserState {
  auth: boolean;
  token: string;
}

const initialState = {
  auth: false,
  token: ''
}

export const userReducer = (state: UserState = initialState, action: UserAction) => {
  switch (action.type) {
    case 'USER/LOGIN':
      return action.payload
    case 'USER/LOGOUT':
      return { auth: false, token: null }
    default:
      return state;
  }
}