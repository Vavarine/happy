import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import DashboardSideBar from '../components/DashboardSideBar';
import { Reducers } from '../reducers';

export default function Dashboard() {
  const userToken = useSelector<Reducers, Reducers['user']>((state) => state.user);

  const history = useHistory();

  useEffect(() => {
    if (userToken.auth === false) {
      history.push('/login?requested=true')
    }
  }, [])

  return (
    <div id="page-dashboard">
      <DashboardSideBar />
      asdfasfd
    </div>
  )
}