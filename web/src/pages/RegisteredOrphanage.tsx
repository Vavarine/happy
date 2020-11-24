import React from "react";
import { useHistory } from "react-router-dom";

import registeredOrphanageImg from '../images/registered-orphanage.svg';

import '../styles/pages/registeredOrphanage.css';

function RegisteredOrphanage() {

  const history = useHistory();

  return (
    <div id="page-registered-orphanage">
      <div className="content-wrapper">
        <main>
          <h1>Ebaaa!</h1>
          <p>O cadastro deu certo e foi enviado ao administrador para ser aprovado. Agora é só esperar :)</p>
          <button onClick={() => { history.push('/app') }} >
            Voltar para o mapa
          </button>
        </main>

        <div className="registered-orphanage-image">
          <img src={registeredOrphanageImg} alt='' />
        </div>
      </div>
    </div>
  )
}

export default RegisteredOrphanage