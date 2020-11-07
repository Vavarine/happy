import React, { useState } from 'react';
import { Link, useHistory, } from 'react-router-dom';
import { FiCheck, FiArrowLeft } from 'react-icons/fi'

import Panel from '../components/Panel';

import '../styles/pages/login.css';

function Login() {
  const [rememberMe, setRememberMe] = useState(false);

  const history = useHistory();

  function handleBackClick() {
    history.goBack();
  }

  function handleRememberMeClick() {
    setRememberMe(!rememberMe);
  }

  return (
    <div id="page-login">
      <Panel />

      <div className='login-container'>
        <div className="back-button" onClick={handleBackClick}>
          <FiArrowLeft color='#15C3D6' size="24" />
        </div>

        <form className='login-form'>
          <fieldset>
            <legend>Fazer Login</legend>

            <div className="input-block">
              <label>E-mail</label>
              <input id='email' />
            </div>

            <div className="input-block">
              <label>Senha</label>
              <input id='password' type='password' />
            </div>

            <div className="login-opts">
              <div className="remember-checkbox" onClick={handleRememberMeClick}>
                {(rememberMe) ? (
                  <div className="checkbox checked">
                    <FiCheck color='#fff' size='16' />
                  </div>
                ) : (
                    <div className="checkbox">

                    </div>
                  )}

                <label>Lembrar-me</label>
              </div>

              <Link className='link' to='/redefine-password'>Esqueci minha senha</Link>
            </div>
          </fieldset>

          <button className='login-button' type='submit'>Entrar</button>
        </form>
      </div>
    </div>
  )
}

export default Login