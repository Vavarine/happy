import React from 'react';
import { useHistory, } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi'

import Panel from '../components/Panel';

import '../styles/pages/newPassword.css';

function NewPassword() {
  const history = useHistory();

  return (
    <div id="page-new-password">
      <Panel />

      <div className='login-container'>

        <form className='new-password-form'>
          <fieldset>
            <legend>Redefinição de senha</legend>

            <p>Escolha uma nova senha para acessar o dashboard do Happy</p>

            <div className="input-block">
              <label>Nova senha</label>
              <input type='password' id='new-password' />
            </div>

            <div className="input-block">
              <label>Repetir senha</label>
              <input type='password' id='repeat-password' />
            </div>

          </fieldset>

          <button className='login-button' type='submit'>Definir</button>
        </form>
      </div>
    </div>
  )
}

export default NewPassword