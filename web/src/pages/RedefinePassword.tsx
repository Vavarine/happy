import React, { FormEvent, useEffect, useState } from 'react';
import { useHistory, } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import emailValidator from 'email-validator';

import Panel from '../components/Panel';

import '../styles/pages/redefinePassword.css';
import api from '../services/api';
import { ValidationErrors } from './Login';
import { MoonLoader } from 'react-spinners';

function RedefinePassword() {
  const [errorMessage, setErrorMessage] = useState('');
  const [submitButtonText, setSubmitButtonText] = useState('Enviar');
  const [submitLoading, setSubmitLoading] = useState(false);

  const [email, setEmail] = useState('')
  const [isEmailValid, setIsEmailValid] = useState(false)

  const history = useHistory();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!isEmailValid) {
      handleInvalidEmail('Preencha o campo com um email valido.');
      return
    }

    setSubmitLoading(true);

    api.post('users/update-password', { email }).then(response => {
      setSubmitLoading(false);

      setSubmitButtonText('Enviado :)')

      setTimeout(() => { history.push('/') }, 1000);
    }).catch(err => {
      if (err.response.status === 404) {
        handleInvalidEmail('Email não cadastrado.')
      }

      if (err.response.data.message === 'Validation errors') {
        handleValidationErrors(err.response.data)
      }
    })
  }

  function handleValidationErrors(err: ValidationErrors) {
    const elements = Object.keys(err.errors)

    elements.forEach(element => {
      document.getElementById(element)!.className = 'invalid';
    });

    document.getElementById(elements[0])!.focus();
  }

  function handleInvalidEmail(message: string) {
    document.getElementById('email')!.className = 'invalid';

    setErrorMessage(message);
  }

  function handleBackClick() {
    history.goBack();
  }

  useEffect(() => {
    if (emailValidator.validate(email)) {
      setIsEmailValid(true)
    } else {
      setIsEmailValid(false)
    }
  }, [email])

  return (
    <div id="page-redefine-password">
      <Panel />

      <div className='login-container'>
        <div className="back-button" onClick={handleBackClick}>
          <FiArrowLeft color='#15C3D6' size="24" />
        </div>

        <form className='redefine-form' onSubmit={handleSubmit}>
          <fieldset>
            <legend>Esqueci a senha</legend>

            <p>Sua redefinição de senha será enviada para o e-mail cadastrado. Lembre-se de verificar sua caixa de span</p>

            <div className="input-block">
              <label>E-mail</label>
              <input
                id='email'
                value={email}
                className={isEmailValid ? 'valid' : ''}
                onChange={(event) => { setEmail(event.target.value) }}
              />
            </div>

          </fieldset>

          <button className='login-button' type='submit'>
            {(submitLoading) ? (
              <MoonLoader
                size={30}
                color={"#123abc"}
                loading={submitLoading}
              />
            ) :
              submitButtonText
            }
          </button>
        </form>

        <p className='error-message'>{errorMessage}</p>
      </div>
    </div>
  )
}

export default RedefinePassword