import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiClock, FiInfo, FiXCircle, FiCheck } from "react-icons/fi";
import { Map, Marker, TileLayer } from "react-leaflet";
import { useState } from "react";
import { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import '../styles/pages/ValidateOrphanage.css';
import Sidebar from "../components/SideBar";
import mapIcon from "../utils/mapIcon";
import api from "../services/api";
import LoadingScreen from "../components/LoadingScreen";
import { Reducers } from "../reducers";
import { MoonLoader } from "react-spinners";
import { setTimeout } from "timers";

export interface Orphanage {
   id: number;
   latitude: number;
   longitude: number;
   name: string;
   about: string;
   instructions: string;
   opening_hours: string;
   open_on_weekends: string;
   validated: boolean;
   images: Array<{
      id: number;
      url: string
   }>;
}

interface orphanageParams {
   orphanageId: string
}

export default function ValidateOrphanage() {
   const userToken = useSelector<Reducers, Reducers['user']>((state) => state.user);
   const { orphanageId } = useParams<orphanageParams>();
   const [orphanage, setOrphanage] = useState<Orphanage>();
   const [activeImageIndex, setActiveImageIndex] = useState(0);
   const [loading, setLoading] = useState(true);
   const [validateLoading, setValidateLoading] = useState(false);
   const [validateButtonText, setValidateButtonText] = useState('Validar');

   const history = useHistory();

   useEffect(() => {
      if (userToken.auth === false) {
         history.push('/login?requested=true')
      } else {
         api.get('users/permissions', {
            headers: {
               'x-access-token': userToken.token
            }
         }).then(response => {
            setLoading(false);

            if (response.status === 401) {
               document.querySelector("#page")
            }

            api.get(`/orphanages/${orphanageId}`).then(response => {
               setOrphanage(response.data);
            });
         })
      }


   }, [orphanageId]);

   function handleOrphanageDelete() {
      history.push(`/orphanages/delete/${orphanage?.id}`)
   }

   function handleValidateOrphanage() {
      setValidateLoading(true);

      api.get(`orphanages/validate/${orphanage?.id}`, {
         headers: {
            'x-access-token': userToken.token
         }
      }).then(response => {
         setValidateLoading(false);

         setValidateButtonText('Tudo cero :)');
         setTimeout(() => { history.goBack() }, 800);
      }).catch(err => {
         setValidateLoading(false);

         if (err.response.status === 401) {
            setValidateButtonText('Não autorizado');
            setTimeout(() => { setValidateButtonText('Validar'); }, 1000);

            return
         }

         setValidateButtonText('Erro interno');
         setTimeout(() => { setValidateButtonText('Validar'); }, 1000);
      })
   }

   if (!orphanage) {
      return (
         <div id="page-validate-orphanage">
            <Sidebar />
            <LoadingScreen />
         </div>
      )
   }

   if (loading) {
      return (
         <div id="page-validate-orphanage">
            <Sidebar />
            <LoadingScreen />
         </div>
      )
   }

   return (
      <div id="page-validate-orphanage">
         <Sidebar />

         <main>
            <div className="orphanage-details">
               <img src={orphanage.images[activeImageIndex].url} alt={orphanage.name} />

               <div className="images">
                  {orphanage.images.map((image, index) => {
                     return (
                        <button
                           key={image.id}
                           className={index === activeImageIndex ? 'active' : ''}
                           type="button"
                           onClick={() => {
                              setActiveImageIndex(index)
                           }}
                        >
                           <img src={image.url} alt={orphanage.name} />
                        </button>
                     )
                  })}
               </div>

               <div className="orphanage-details-content">
                  <h1>{orphanage.name}</h1>
                  <p>
                     {orphanage.about}
                  </p>

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
                        <a
                           target="_blank"
                           rel="noopener noreferrer"
                           href={`https://www.google.com/maps/dir/?api=1&destination=${orphanage.latitude},${orphanage.longitude}`}
                        >
                           Ver rotas no Google Maps
                        </a>
                     </footer>
                  </div>

                  <hr />

                  <h2>Instruções para a visita</h2>
                  <p>{orphanage.instructions}</p>

                  <div className="open-details">
                     <div className="hour">
                        <FiClock size={32} color="#15B6D6" />
                           Segunda à Sexta <br />
                        {orphanage.opening_hours}
                     </div>
                     {orphanage.open_on_weekends ? (
                        <div className="open-on-weekends">
                           <FiInfo size={32} color="#39CC83" />
                           Atendemos <br />
                           fim de semana
                        </div>
                     ) : (
                           <div className="open-on-weekends dont-open">
                              <FiInfo size={32} color="#FF669D" />
                           Não atendemos <br />
                           fim de semana
                           </div>
                        )}

                  </div>
               </div>

               <div className='validate-opts'>
                  <button className='red' onClick={handleOrphanageDelete}>
                     <FiXCircle size={24} color='#fff' />
                     <p>Recusar</p>
                  </button>
                  <button className='green' onClick={handleValidateOrphanage}>
                     {(validateLoading) ? (
                        <MoonLoader
                           size={30}
                           color={"#123abc"}
                           loading={validateLoading}
                        />
                     ) : (
                           <>
                              <p>{validateButtonText}</p>
                              {(validateButtonText === 'Validar') ? <FiCheck size={24} color='#fff' /> : ''}
                           </>
                        )
                     }

                  </button>
               </div>
            </div>
         </main>
      </div >
   );
}