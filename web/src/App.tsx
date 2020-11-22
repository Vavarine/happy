import React, { useEffect, useState } from 'react';

import './styles/global.css';
import 'leaflet/dist/leaflet.css';

import Routes from './routes';
import { useDispatch, useSelector } from 'react-redux';

import { Reducers } from './reducers';
import { login } from './actions';
import { UserState } from './reducers/userReducer';

import LoadingScreen from './components/LoadingScreen';
import api from './services/api';

function App() {
  const userToken = useSelector<Reducers, Reducers['user']>((state) => state.user);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    const storagedUserToken = localStorage.getItem('userToken');
    const sessionStoragedUserToken = sessionStorage.getItem('userToken');

    console.log(process.env.HAPPY_SERVER_API_URL)

    if (storagedUserToken) {
      const parsedUserToken: UserState = JSON.parse(storagedUserToken);

      api.get('users/auth', {
        headers: {
          'x-access-token': parsedUserToken.token
        }
      }).then(response => {
        dispatch(login(parsedUserToken));
        setLoading(false)
      }).catch(err => {
        console.log(err.response.data.message);
      }).finally(() => {
        setLoading(false);
      });

    } else if (sessionStoragedUserToken) {
      const parsedUserToken: UserState = JSON.parse(sessionStoragedUserToken);

      api.get('users/auth', {
        headers: {
          'x-access-token': parsedUserToken.token
        }
      }).then(response => {
        dispatch(login(parsedUserToken));
      }).catch(err => {
        console.log(err.response.data.message);
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [])

  if (loading) {
    return (
      <LoadingScreen />
    )
  }

  return (
    <Routes />
  );
}

export default App;
