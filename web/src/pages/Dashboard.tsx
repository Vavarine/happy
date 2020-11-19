import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import DashboardSideBar from '../components/DashboardSideBar';
import LoadingScreen from '../components/LoadingScreen';
import { Reducers } from '../reducers';
import api from '../services/api';
import { Orphanage } from './Orphanage';
import { Map, Marker, TileLayer } from "react-leaflet";
import { FiEdit3, FiTrash } from 'react-icons/fi'

import mapIcon from "../utils/mapIcon";

import '../styles/pages/dashbord.css';

export default function Dashboard() {
  const userToken = useSelector<Reducers, Reducers['user']>((state) => state.user);
  const [loading, setLoading] = useState(true);

  const [pageTitle, setPageTitle] = useState('Meus Orfanatos Cadastrados')

  const [selectedMenuItem, setSelectedMenuItem] = useState('approved');
  const [selectValidatedOrphanages, setSelectValidatedOrphanages] = useState(true);
  const [userOrphanages, setUserOrphanages] = useState<Orphanage[]>()

  const history = useHistory();
  useEffect(() => {
    if (userToken.auth === false) {
      history.push('/login?requested=true')
    } else {

      api.get('users/orphanages', {
        headers: {
          'x-access-token': userToken.token
        }
      }).then(response => {
        setUserOrphanages(response.data.orphanages);
        setLoading(false);
      })

    }
  }, []);

  useEffect(() => {
    if (selectedMenuItem === 'approved') {
      setSelectValidatedOrphanages(true);
      setPageTitle('Meus Orfanatos Cadastrados');
    } else {
      setSelectValidatedOrphanages(false);
      setPageTitle('Meus Cadastrados Pendentes');
    }
  }, [selectedMenuItem]);

  function handleOrphanageDelete(orphanageId: number) {
    history.push(`/orphanages/delete/${orphanageId}`)
  }

  if (loading) {
    return (
      <div id="page-dashboard">
        <DashboardSideBar selected={selectedMenuItem} onSelecteChange={setSelectedMenuItem} />
        <LoadingScreen />
      </div>
    )
  }

  return (
    <div id="page-dashboard">
      <DashboardSideBar selected={selectedMenuItem} onSelecteChange={setSelectedMenuItem} />

      <main>
        <div className="content-wrapper">
          <h1>{pageTitle}</h1>

          <div className="orphanages-wrapper">
            {userOrphanages?.map(orphanage => {
              if (orphanage.validated === selectValidatedOrphanages) {
                return (
                  <div key={orphanage.id} className="orphanage-container">

                    <div className="map-container">

                      <Map
                        center={[orphanage.latitude, orphanage.longitude]}
                        zoom={16}
                        style={{ width: '100%', height: 280 }}
                        dragging={false}
                        touchZoom={false}
                        zoomControl={false}
                        scrollWheelZoom={false}
                        doubleClickZoom={false}
                      >
                        <TileLayer
                          url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                        />
                        <Marker interactive={false} icon={mapIcon} position={[orphanage.latitude, orphanage.longitude]} />
                      </Map>

                      <footer>
                        <h2>{orphanage.name}</h2>
                        <div className="orphanage-opts">
                          <button><FiEdit3 color='#15C3D6' /></button>
                          <button><FiTrash color='#15C3D6' onClick={() => handleOrphanageDelete(orphanage.id)} /></button>
                        </div>

                      </footer>
                    </div>
                  </div>
                )
              }
            })}
          </div>
        </div>
      </main>
    </div>
  )
}