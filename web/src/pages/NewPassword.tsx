import React, { FormEvent, useEffect, useState } from 'react';
import { useHistory, useParams, } from 'react-router-dom';

import Panel from '../components/Panel';
import LoadingScreen from '../components/LoadingScreen';

import '../styles/pages/newPassword.css';
import api from '../services/api';
import { MoonLoader } from 'react-spinners';
import { setTimeout } from 'timers';

interface NewPasswordParams {
  newPasswordToken?: string
}

function NewPassword() {
  const { newPasswordToken } = useParams<NewPasswordParams>();
  const [loading, setLoading] = useState(true);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitButtonText, setSubmitButtonText] = useState('Definir');
  const [userEmail, setUserEmail] = useState('');

  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [repeatPassword, setRepeatPassword] = useState('');
  const [isRepeatPasswordValid, setIsRepeatPasswordValid] = useState(false);


  const history = useHistory();

  useEffect(() => {
    api.get('/users/update-password/auth-token', {
      headers: {
        'x-password-update-access-token': newPasswordToken
      }
    }).then(response => {
      console.log(response.data);
      setLoading(false);
      setUserEmail(response.data.userEmail)
    }).catch(err => {
      setLoading(false);
      document
        .getElementById('login-container')!
        .innerHTML = "<p class='error-message'>Esse não é um link valido</p>"
    })

  }, [])

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setSubmitLoading(true);

    if (document.getElementById('password')!.className !== 'valid') {
      document.getElementById('password')!.className = 'invalid';
      return
    }

    if (document.getElementById('repeat-password')!.className !== 'valid') {
      document.getElementById('repeat-password')!.className = 'invalid';
      return
    }

    api.put('users/update-password/', { newPassword: password }, {
      headers: {
        'x-password-update-access-token': newPasswordToken
      }
    }).then(response => {
      setSubmitLoading(false);
      setSubmitButtonText('Senha atualizada :)')

      setTimeout(() => { history.push('/login') }, 800);
    }).catch(err => {
      setSubmitLoading(false);
      setSubmitButtonText('Ouve um erro :(')

      setTimeout(() => { setSubmitButtonText('Definir') }, 800);
    })

  }

  useEffect(() => {
    if (password.length >= 6) {
      setIsPasswordValid(true);
    } else {
      setIsPasswordValid(false);
    }

  }, [password]);

  useEffect(() => {
    if (repeatPassword.length >= 6) {
      setIsRepeatPasswordValid(true);
      if (password !== repeatPassword) {
        document.getElementById('repeat-password')!.className = 'invalid';
      } else {
        document.getElementById('repeat-password')!.className = 'valid';
      }
    } else {
      setIsRepeatPasswordValid(false);
    }
  }, [repeatPassword]);

  if (loading) {
    return (
      <LoadingScreen />
    )
  }

  return (
    <div id="page-new-password">
      <Panel />

      <div id='login-container' className='login-container'>

        <form className='new-password-form' onSubmit={handleSubmit}>
          <fieldset>
            <legend>Redefinição de senha</legend>

            <p>Escolha uma nova senha para acessar a conta {userEmail} do Happy</p>

            <div className="input-block">
              <label>Nova senha</label>
              <input
                id='password'
                className={isPasswordValid ? 'valid' : ''}
                type='password'
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label>Repetir senha</label>
              <input
                id='repeat-password'
                className={isRepeatPasswordValid ? 'valid' : ''}
                type='password'
                value={repeatPassword}
                onChange={(event) => setRepeatPassword(event.target.value)}
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
      </div>
    </div>
  )
}

export default NewPassword