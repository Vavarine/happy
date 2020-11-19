import React, { useEffect } from 'react';
import { FiPower, FiMapPin, FiAlertCircle } from 'react-icons/fi';
import { useHistory, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'

import mapMarkerImg from '../images/map-marker.svg';

import '../styles/components/dashboardSidebar.css';
import { Reducers } from '../reducers';
import { logout } from '../actions'

interface DashboardSideBarProps {
  selected: string;
  onSelecteChange: (selected: string) => void;
}

const DashboardSideBar: React.FC<DashboardSideBarProps> = (props) => {
  const userToken = useSelector<Reducers, Reducers['user']>((state) => state.user);
  const { selected, onSelecteChange } = props;

  const dispath = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (selected) {
      document.querySelectorAll('aside div.opts button').forEach(el => {
        el.className = '';
      })

      document.getElementById(selected)!.className = 'selected';
    }
  }, [selected])

  function logOut() {
    dispath(logout(userToken));

    localStorage.removeItem('userToken');
    sessionStorage.removeItem('userToken');

    history.push('/');
  }

  return (
    <aside className="dashboard-sidebar">
      <Link to='/'>
        <img src={mapMarkerImg} alt="Happy" />
      </Link>

      <div className="opts">
        <button id="approved" type="button" onClick={() => { onSelecteChange('approved') }}>
          <FiMapPin size={20} color={(selected === 'approved') ? '#0089A5' : '#fff'} />
        </button>
        <button id="pending" type="button" onClick={() => { onSelecteChange('pending') }}>
          <FiAlertCircle size={20} color={(selected === 'pending') ? '#0089A5' : '#fff'} />
        </button>
      </div>

      <footer>
        <button type="button" onClick={logOut}>
          <FiPower size={24} color="#FFF" />
        </button>
      </footer>
    </aside>
  );
}

export default DashboardSideBar;