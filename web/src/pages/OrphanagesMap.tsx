import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { Map, TileLayer } from 'react-leaflet';

import mapMarkerImg from '../images/logo.svg';

import '../styles/pages/orphanages-map.css';
import 'leaflet/dist/leaflet.css';

function OrphanagesMap() {
   return(
      <div id="page-map">
         <aside>
            <header>
               <img src={mapMarkerImg} alt="Happy"/>

               <h2>Escolha um orfanato no mapa</h2>
               <p>Muitas criaças estão esperando sua visita :)</p>
            </header>

            <footer>
               <strong>Mauá</strong>
               <span>São Paulo</span>
            </footer>
         </aside>

         <Map 
            center={[-23.6712935, -46.468151]}
            zoom={15}
            style={{ width: '100%', height: '100%' }}
         >
            {/* <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' /> */}
            <TileLayer url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`} />
         </Map>

         <Link to='' className="create-orphanage">
            <FiPlus size={26} color="#FFF" />   
         </Link>
      </div>
   )
}
export default OrphanagesMap
