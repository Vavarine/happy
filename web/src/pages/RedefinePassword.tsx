import React, { useState } from 'react';
import { useHistory, } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi'

import Panel from '../components/Panel';

import '../styles/pages/redefinePassword.css';

function RedefinePassword() {
  const history = useHistory();

  function handleBackClick() {
    history.goBack();
  }

  return (
    <div id="page-redefine-password">
      <Panel />

      <div className='login-container'>
        <div className="back-button" onClick={handleBackClick}>
          <FiArrowLeft color='#15C3D6' size="24" />
        </div>

        <form className='redefine-form'>
          <fieldset>
            <legend>Esqueci a senha</legend>

            <p>Sua redefinição de senha será enviada para o e-mail cadastrado.</p>

            <div className="input-block">
              <label>E-mail</label>
              <input id='email' />
            </div>

          </fieldset>

          <button className='login-button' type='submit'>Enviar</button>
        </form>
      </div>
    </div>
  )
}

export default RedefinePassword