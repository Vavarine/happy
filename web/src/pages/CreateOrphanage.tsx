import React, { useState, FormEvent, useEffect, ChangeEvent } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from "leaflet";
import { FiPlus, FiX } from "react-icons/fi";
import MoonLoader from "react-spinners/MoonLoader";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import '../styles/pages/create-orphanage.css';

import Sidebar from "../components/SideBar";
import mapIcon from "../utils/mapIcon";
import api from "../services/api";

import { Reducers } from "../reducers";

interface position {
   latitude: number,
   longitude: number
}

export default function CreateOrphanage() {
   const userToken = useSelector<Reducers, Reducers['user']>((state) => state.user);

   const initialMapPos = { latitude: -23.6025555, longitude: -46.5694478 };

   const [position, setPosition] = useState<position>({ latitude: 0, longitude: 0 });
   const [deviceLocation, setDeviceLocation] = useState<position>({
      latitude: initialMapPos.latitude, longitude: initialMapPos.longitude
   });

   const [name, setName] = useState('');
   const [about, setAbout] = useState('');
   const [instructions, setInstructions] = useState('');
   const [opening_hours, setOpeningHours] = useState('');
   const [open_on_weekends, setOpenOnWeekends] = useState(true);
   const [images, setImages] = useState<File[]>([]);
   const [imagesPreview, setImagesPreview] = useState<string[]>([]);
   const [loading, setLoading] = useState(false);
   const [submitButtonText, setSubmitButtonText] = useState("Confirmar");

   const history = useHistory();

   useEffect(() => {
      if (userToken.auth === false) {
         history.push('/login/true')
      }

      navigator.geolocation.getCurrentPosition(position => {
         setDeviceLocation(position.coords)
      })
   }, [])

   function handleMapClick(event: LeafletMouseEvent) {
      //console.log(event.latlng);

      setPosition({
         latitude: event.latlng.lat,
         longitude: event.latlng.lng
      });
   }

   async function handleSubmit(event: FormEvent) {
      setLoading(true);

      event.preventDefault();

      const { latitude, longitude } = position;

      const data = new FormData();

      data.append('name', name);
      data.append('latitude', String(latitude));
      data.append('longitude', String(longitude));
      data.append('about', about);
      data.append('instructions', instructions);
      data.append('opening_hours', opening_hours);
      data.append('open_on_weekends', String(open_on_weekends));

      images.forEach(image => {
         data.append('images', image);
      });

      console.log(userToken);

      await api.post('orphanages', data, {
         headers: {
            'x-access-token': userToken.token
         }
      }).then(() => {
         setSubmitButtonText('Salvo!');
         setLoading(false);
         setTimeout(() => { setSubmitButtonText('Confirmar'); history.push('/app'); }, 1000);

      }).catch(err => {
         console.log(err.response.data.message);
         setSubmitButtonText('Erro interno');
         setLoading(false);
         setTimeout(() => { setSubmitButtonText('Confirmar') }, 1000);
      })
   }

   function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
      if (!event.target.files) {
         return
      }
      const selectedImages = Array.from(event.target.files);

      setImages([...images, ...selectedImages]);

      const selectedImagesPreview = selectedImages.map(selectedImage => {
         return URL.createObjectURL(selectedImage);
      })

      setImagesPreview([...imagesPreview, ...selectedImagesPreview,]);
   }

   function handleRemoveImage(image: string) {
      const index = imagesPreview.indexOf(image);
      const imagesPreviewAux = imagesPreview;
      const imagesAux = images;


      imagesPreviewAux.splice(index, 1);
      imagesAux.splice(index, 1);

      setImagesPreview([...imagesPreviewAux]);
      setImages([...imagesAux])
   }

   useEffect(() => { console.log(images) }, [images])

   return (
      <div id="page-create-orphanage">
         <Sidebar />

         <main>
            <form onSubmit={handleSubmit} className="create-orphanage-form">
               <fieldset>
                  <legend>Dados</legend>

                  <Map
                     center={[deviceLocation.latitude, deviceLocation.longitude]}
                     style={{ width: '100%', height: 280 }}
                     zoom={(deviceLocation.latitude == initialMapPos.latitude) ? 8 : 14}
                     onClick={handleMapClick}
                  >
                     <TileLayer
                        url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                     />

                     {(position && position.latitude != 0) && (
                        <Marker
                           interactive={false}
                           icon={mapIcon}
                           position={[
                              position.latitude,
                              position.longitude
                           ]}
                        />
                     )}

                  </Map>

                  <div className="input-block">
                     <label htmlFor="name">Nome</label>
                     <input
                        id="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                     />
                  </div>

                  <div className="input-block">
                     <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
                     <textarea
                        id="about"
                        maxLength={300}
                        value={about}
                        onChange={e => setAbout(e.target.value)}
                     />
                  </div>

                  <div className="input-block">
                     <label htmlFor="images">Fotos</label>

                     <div className="images-container">
                        {imagesPreview.map(image => {
                           return (
                              <div key={image} className="image">
                                 <button type='button' onClick={() => handleRemoveImage(image)}>
                                    <FiX color='FF669D' size={24} />
                                 </button>

                                 <img src={image} alt="" />
                              </div>
                           )
                        })}

                        <label htmlFor="image[]" className="new-image">
                           <FiPlus size={24} color="#15b6d6" />
                        </label>
                     </div>

                     <input multiple onChange={handleSelectImages} type="file" id="image[]" />

                  </div>
               </fieldset>

               <fieldset>
                  <legend>Visitação</legend>

                  <div className="input-block">
                     <label htmlFor="instructions">Instruções</label>
                     <textarea
                        id="instructions"
                        value={instructions}
                        onChange={e => setInstructions(e.target.value)}
                     />
                  </div>

                  <div className="input-block">
                     <label htmlFor="opening_hours">Horário de funcionamento</label>
                     <input
                        id="opening_hours"
                        value={opening_hours}
                        onChange={e => setOpeningHours(e.target.value)}
                     />
                  </div>

                  <div className="input-block">
                     <label htmlFor="open_on_weekends">Atende fim de semana</label>

                     <div className="button-select">
                        <button
                           type="button"
                           className={open_on_weekends ? 'active' : ''}
                           onClick={() => { setOpenOnWeekends(true) }}
                        >
                           Sim
                        </button>
                        <button
                           type="button"
                           className={!open_on_weekends ? 'active' : ''}
                           onClick={() => { setOpenOnWeekends(false) }}
                        >
                           Não
                        </button>
                     </div>
                  </div>
               </fieldset>

               <button className="confirm-button" type="submit">
                  {
                     (!loading) ?
                        submitButtonText
                        :
                        <MoonLoader color={"#ffffff"} size={30} loading={loading} />
                  }
               </button>
            </form>
         </main>
      </div>
   );
}
