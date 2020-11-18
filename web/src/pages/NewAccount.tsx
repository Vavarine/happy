import React, { FormEvent, useEffect, useState } from 'react';
import { useHistory, } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi'
import emailValidator from 'email-validator';
import MoonLoader from 'react-spinners/MoonLoader';

import Panel from '../components/Panel';

import '../styles/pages/newAccount.css';
import api from '../services/api';
import { ValidationErrors } from './Login';

function NewAccount() {
  const [errorMessage, setErrorMessage] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitButtonText, setSubmitButtonText] = useState('Enviar');

  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [name, setName] = useState('');
  const [isNameValid, setIsNameValid] = useState(false);
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const history = useHistory();


  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setSubmitLoading(true);
    setErrorMessage('');

    const data = {
      email,
      name,
      password
    }

    api.post('users/create', data).then(response => {
      setSubmitLoading(false);
      setSubmitButtonText('Salvo!');

      setTimeout(() => { history.push('/login') }, 800)
    }).catch(err => {
      console.log(err.response.data.message)
      if (err.response.data.message === 'Invalid login') {
        handleInvalidForm()
      }

      if (err.response.data.message === 'Validation errors') {
        handleValidationErrors(err.response.data)
      }
    })
  }

  function handleInvalidForm() {

  }

  function handleValidationErrors(err: ValidationErrors) {
    const elements = Object.keys(err.errors)

    elements.forEach(element => {
      document.getElementById(element)!.className = 'invalid';
    });

    document.getElementById(elements[0])!.focus();
  }

  function handleBackClick() {
    history.goBack();
  }

  useEffect(() => {
    console.log(email);

    if (emailValidator.validate(email)) {
      setIsEmailValid(true)
    } else {
      setIsEmailValid(false)
    }

    console.log(isEmailValid);

  }, [email]);

  useEffect(() => {
    if (name.length >= 3) {
      setIsNameValid(true)
    } else {
      setIsNameValid(false)
    }
  }, [name]);

  useEffect(() => {
    if (password.length >= 6) {
      setIsPasswordValid(true)
    } else {
      setIsPasswordValid(false)
    }
  }, [password]);

  return (
    <div id="page-new-account">
      <Panel />

      <div className='login-container'>
        <div className="back-button" onClick={handleBackClick}>
          <FiArrowLeft color='#15C3D6' size="24" />
        </div>

        <form className='new-account-form' onSubmit={handleSubmit}>
          <fieldset>
            <legend>Nova conta</legend>

            <div className="input-block">
              <label>E-mail</label>
              <input
                id='email'
                value={email}
                className={isEmailValid ? 'valid' : ''}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label>Nome</label>
              <input
                id='name'
                value={name}
                className={isNameValid ? 'valid' : ''}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label>Senha</label>
              <input
                id='password'
                type='password'
                value={password}
                className={isPasswordValid ? 'valid' : ''}
                onChange={(event) => setPassword(event.target.value)}
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

export default NewAccount