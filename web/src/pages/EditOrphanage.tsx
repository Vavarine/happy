import React, { useState, FormEvent, useEffect, ChangeEvent, SetStateAction } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from "leaflet";
import { FiPlus, FiX } from "react-icons/fi";
import MoonLoader from "react-spinners/MoonLoader";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import '../styles/pages/create-orphanage.css';

import Sidebar from "../components/SideBar";
import mapIcon from "../utils/mapIcon";
import api from "../services/api";

import { Reducers } from "../reducers";
import { Orphanage } from "./Orphanage";
import LoadingScreen from "../components/LoadingScreen";
import { timeStamp } from "console";
import { randomBytes } from "crypto";
import { ValidationErrors } from "./Login";

interface position {
   latitude: number,
   longitude: number
}

interface UpdateOrphanageParams {
   orphanageId: string
}

export default function EditOrphanage() {
   const userToken = useSelector<Reducers, Reducers['user']>((state) => state.user);
   const { orphanageId } = useParams<UpdateOrphanageParams>();

   const initialMapPos = { latitude: -23.6025555, longitude: -46.5694478 };

   const [toBeUpdatedOrphanage, setToBeUpdatedOrphanage] = useState<Orphanage>();

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
   const [loading, setLoading] = useState(true);
   const [submitLoading, setSubmitLoading] = useState(false)
   const [submitButtonText, setSubmitButtonText] = useState("Atualizar");

   const history = useHistory();

   useEffect(() => {
      if (userToken.auth === false) {
         history.push('/login/true')
      }

      navigator.geolocation.getCurrentPosition(position => {
         setDeviceLocation(position.coords)
      });

      loadToBeUpdatedOrphanage();

   }, []);

   // Quando o toBeUpdatedOrphanage é carregado seus parametros são passados 
   // para as variáveis locais de valores dos campos do formulário
   useEffect(() => {
      if (loading === false) {
         setName(toBeUpdatedOrphanage!.name);
         setAbout(toBeUpdatedOrphanage!.about);
         setInstructions(toBeUpdatedOrphanage!.instructions);
         setOpeningHours(toBeUpdatedOrphanage!.opening_hours);
         setOpenOnWeekends(toBeUpdatedOrphanage!.open_on_weekends === 'true' ? true : false);

         if (toBeUpdatedOrphanage?.images) {
            imgsUrlToFiles(toBeUpdatedOrphanage.images);
         }

      }
   }, [toBeUpdatedOrphanage, loading]);

   function loadToBeUpdatedOrphanage() {
      api.get(`orphanages/${orphanageId}`).then(response => {
         setToBeUpdatedOrphanage(response.data);

         setLoading(false);

         setPosition({ latitude: response.data.latitude, longitude: response.data.longitude });
         setOpenOnWeekends(response.data.open_on_weekends);
      }).catch(err => {
         setLoading(false);
         handleLoadOrphanageError('Erro ao carregar orfanato :(');
      })
   }

   function imgsUrlToFiles(imgs: Orphanage['images']) {
      var loadedImages: File[] = [];
      var loadedImagesPreview: string[] = [];

      imgs.forEach(async (img) => {
         const fileName = img.url.split('/')[4];

         const blob = await fetch(img.url).then(r => r.blob());

         const dataUrl = await new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
         });

         const fileImage = imgDataUriToFile(String(dataUrl), fileName);

         loadedImages.push(fileImage)
         loadedImagesPreview.push(URL.createObjectURL(fileImage));
      });

      setImagesPreview(loadedImagesPreview);
      setImages(loadedImages);
   }

   function imgDataUriToFile(dataUri: string, fileName: string) {
      var byteString = atob(dataUri.split(',')[1]);

      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);

      for (var i = 0; i < byteString.length; i++) {
         ia[i] = byteString.charCodeAt(i);
      }

      var blob = new Blob([ia], { type: 'image/jpeg' });
      var file = new File([blob], fileName);

      return file;
   }

   function handleLoadOrphanageError(message: string) {
      document.querySelector('#page-create-orphanage main')!.innerHTML = message;
   }

   function handleMapClick(event: LeafletMouseEvent) {
      //console.log(event.latlng);

      setPosition({
         latitude: event.latlng.lat,
         longitude: event.latlng.lng
      });
   }

   async function handleSubmit(event: FormEvent) {
      setSubmitLoading(true);

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

      //console.log(userToken);

      await api.put(`orphanages/${orphanageId}`, data, {
         headers: {
            'x-access-token': userToken.token
         }
      }).then(() => {
         setSubmitButtonText('Salvo!');
         setSubmitLoading(false);

         setTimeout(() => { setSubmitButtonText('Atualizar'); history.goBack(); }, 1000);
      }).catch(err => {
         setSubmitLoading(false);

         if (err.response.data.message === 'Validation errors') {
            handleValidationErrors(err.response.data);
            setSubmitButtonText('Preencha todos os campos!');
         } else {
            setSubmitButtonText('Erro interno');
         }

         setTimeout(() => { setSubmitButtonText('Atualizar') }, 1000);
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

   function handleValidationErrors(err: ValidationErrors) {
      console.log(err.errors);

      const elements = Object.keys(err.errors)

      elements.forEach(element => {
         if (element === 'images') {
            return
         }
         document.getElementById(element)!.className = 'invalid';
      });

      if (elements[0] === 'images') {
         document.getElementById('image-select-button')!.focus();
      } else {
         document.getElementById(elements[0])!.focus();
      }


   }

   //useEffect(() => { console.log(images) }, [images])

   useEffect(() => {
      if (loading) return
      document.getElementById('name')!.className = '';
   }, [name]);

   useEffect(() => {
      if (loading) return
      document.getElementById('about')!.className = '';
   }, [about]);

   useEffect(() => {
      if (loading) return
      document.getElementById('instructions')!.className = '';
   }, [instructions]);

   useEffect(() => {
      if (loading) return
      document.getElementById('opening_hours')!.className = '';
   }, [opening_hours]);

   if (loading) {
      return (
         <div id="page-create-orphanage">
            <Sidebar />
            <LoadingScreen />
         </div>
      )
   }

   return (
      <div id="page-create-orphanage">
         <Sidebar />

         <main>
            <form onSubmit={handleSubmit} className="create-orphanage-form">
               <fieldset>
                  <legend>Dados</legend>

                  <Map
                     center={[toBeUpdatedOrphanage!.latitude, toBeUpdatedOrphanage!.longitude]}
                     style={{ width: '100%', height: 280 }}
                     zoom={14}
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

                        <label id='image-select-button' htmlFor="image[]" className="new-image">
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
                     (!submitLoading) ?
                        submitButtonText
                        :
                        <MoonLoader color={"#ffffff"} size={30} loading={submitLoading} />
                  }
               </button>
            </form>
         </main>
      </div>
   );
}
