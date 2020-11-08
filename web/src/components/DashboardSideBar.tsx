import React from 'react';
import { FiPower } from 'react-icons/fi';
import { useHistory, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'

import mapMarkerImg from '../images/map-marker.svg';

import '../styles/components/sidebar.css';
import { Reducers } from '../reducers';
import { logout } from '../actions'

export default function DashboardSideBar() {
  const userToken = useSelector<Reducers, Reducers['user']>((state) => state.user);

  const dispath = useDispatch();
  const history = useHistory();

  function logOut() {
    dispath(logout(userToken));

    localStorage.removeItem('userToken');
    sessionStorage.removeItem('userToken');

    history.push('/');
  }

  return (
    <aside className="app-sidebar">

      <Link to='/'>
        <img src={mapMarkerImg} alt="Happy" />
      </Link>
      <footer>
        <button type="button" onClick={logOut}>
          <FiPower size={24} color="#FFF" />
        </button>
      </footer>
    </aside>
  );
}
