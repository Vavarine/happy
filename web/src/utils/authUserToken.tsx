import { UserState } from "../reducers/userReducer";
import api from "../services/api";

export async function authUserTokenServer(userToken: UserState): Promise<number> {
  const response = await api.get('users/authToken', {
    headers: {
      'x-access-token': userToken.token
    }
  })

  return response.status
}
