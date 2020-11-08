import React, { useState } from 'react';
import { useHistory, } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi'

import Panel from '../components/Panel';

import '../styles/pages/newAccount.css';

function NewAccount() {
  const history = useHistory();

  function handleBackClick() {
    history.goBack();
  }

  return (
    <div id="page-new-account">
      <Panel />

      <div className='login-container'>
        <div className="back-button" onClick={handleBackClick}>
          <FiArrowLeft color='#15C3D6' size="24" />
        </div>

        <form className='new-account-form'>
          <fieldset>
            <legend>Nova conta</legend>

            <p>Um e-mail de ativação de conta será enviado.</p>

            <div className="input-block">
              <label>E-mail</label>
              <input id='email' />
            </div>

            <div className="input-block">
              <label>Nome</label>
              <input id='name' />
            </div>

            <div className="input-block">
              <label>Senha</label>
              <input id='password' type='password' />
            </div>

          </fieldset>

          <button className='login-button' type='submit'>Enviar</button>
        </form>
      </div>
    </div>
  )
}

export default NewAccount