import React, { useEffect, useState } from 'react';

import './styles/global.css';
import 'leaflet/dist/leaflet.css';

import Routes from './routes';
import { useDispatch, useSelector } from 'react-redux';

import { Reducers } from './reducers';
import { login } from './actions';
import { UserState } from './reducers/userReducer';

import LoadingScreen from './components/LoadingScreen';

function App() {
  const userToken = useSelector<Reducers, Reducers['user']>((state) => state.user);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    const storagedUserToken = localStorage.getItem('userToken');
    const sessionStoragedUserToken = sessionStorage.getItem('userToken');

    if (storagedUserToken) {
      const parsedUserToken: UserState = JSON.parse(storagedUserToken);
      dispatch(login(parsedUserToken));
    } else if (sessionStoragedUserToken) {
      const parsedUserToken: UserState = JSON.parse(sessionStoragedUserToken);
      dispatch(login(parsedUserToken));
    }

    setLoading(false)
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
