import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiArrowLeft } from "react-icons/fi";

import { Reducers } from "../reducers";
import LoadingScreen from "../components/LoadingScreen";
import api from "../services/api";

import DeleteOrphanageImg from '../images/delete-orphanage.svg';

import '../styles/pages/deleteOrphanage.css';
import { Orphanage } from "./Orphanage";
import { MoonLoader } from "react-spinners";

interface DeleteOrphanageParams {
   orphanageId: string
}

function DeleteOrphanage() {
   const { orphanageId } = useParams<DeleteOrphanageParams>();
   const userToken = useSelector<Reducers, Reducers['user']>((state) => state.user);

   const [orphanage, setOrphanage] = useState<Orphanage>();
   const [loading, setLoading] = useState(true);
   const [deleteLoading, setDeletLoading] = useState(false);
   const [deleteButtonText, setDeleteButtonText] = useState('Excluir orfanato');

   const history = useHistory();

   useEffect(() => {
      if (userToken.auth === false) {
         history.push('/login?requested=true')
      } else {
         api.get(`orphanages/${orphanageId}`).then(response => {
            const toBeDeletedOrphanage = response.data as Orphanage;

            console.log(toBeDeletedOrphanage);

            api.get('users/orphanages', {
               headers: {
                  'x-access-token': userToken.token
               }
            }).then(response => {
               const orphanages = response.data.orphanages as Array<Orphanage>;

               console.log(orphanages);

               if (orphanages.filter(o => o.id === toBeDeletedOrphanage.id).length > 0) {
                  setLoading(false);
               } else {
                  setLoading(false);
                  handleLoadOrphanageError("Você não tem permissão");
               }
            }).catch(err => {
               setLoading(false);
               handleLoadOrphanageError("Ouve um erro :(");
            })

         }).catch(err => {
            console.log(err.response.status)
            if (err.response.status === 404) {
               setLoading(false);
               handleLoadOrphanageError("Não encontramos o orfanato :(");
            }
         })
      }
   }, [])

   function handleLoadOrphanageError(message: string) {
      document.getElementsByClassName("content-wrapper")[0]!.innerHTML = message;
   }

   function handleBackClick() {
      history.goBack();
   }

   function handleDelete() {

   }

   if (loading) {
      return (
         <LoadingScreen backgroundColor="#FF669D" />
      )
   }

   return (
      <div id="page-delete-orphanage">
         <div className="back-button" onClick={handleBackClick}>
            <FiArrowLeft color='#FF669D' size="24" />
         </div>
         <div className="content-wrapper">
            <main>
               <h1>Excluir!</h1>
               <p>Voce tem certeza que quer excluir sdfasdf?</p>
               <button onClick={handleDelete}>{(deleteLoading) ? (
                  <MoonLoader
                     size={30}
                     color={"#123abc"}
                     loading={deleteLoading}
                  />
               ) :
                  deleteButtonText
               }</button>
            </main>

            <div className="delete-orphanage-image">
               <img src={DeleteOrphanageImg} alt='' />
            </div>
         </div>
      </div>
   );
}

export default DeleteOrphanage
