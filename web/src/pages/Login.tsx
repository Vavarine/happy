import React, { useState, FormEvent, useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { FiCheck, FiArrowLeft } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux';
import emailValidator from 'email-validator';

import '../styles/pages/login.css';

import Panel from '../components/Panel';
import { login } from '../actions';
import api from '../services/api';

import { Reducers } from '../reducers';

interface ValidationErrors {
  message: string;
  errors: {
    [key: string]: string[]
  }[]
}

interface UserToken {
  auth: boolean;
  token: string
}

interface LoginParams {
  requested?: string
}

function Login() {
  const params = useParams<any>();
  const userToken = useSelector<Reducers, Reducers['user']>((state) => state.user);
  const [loading, setLoading] = useState(true);

  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIspasswordValid] = useState(false);

  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(params)

    if (userToken.auth === true) {
      history.push('/dashboard');
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (emailValidator.validate(email)) {
      setIsEmailValid(true)
    } else {
      setIsEmailValid(false)
    }
  }, [email]);

  useEffect(() => {
    if (password.length >= 6) {
      setIspasswordValid(true)
    } else {
      setIspasswordValid(false)
    }
  }, [password]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setErrorMessage('');

    const data = {
      email,
      password
    }

    api.post('users/login', data).then(response => {
      handleLogin(response.data);
    }).catch(err => {
      console.log(err.response.data.message)
      if (err.response.data.message === 'Invalid login') {
        handleInvalidLogin()
      }

      if (err.response.data.message === 'Validation errors') {
        handleValidationErrors(err.response.data)
      }
    })
  }

  function handleLogin(user: UserToken) {
    dispatch(login(user))

    if (rememberMe) {
      localStorage.setItem('userToken', JSON.stringify(user))
    } else {
      sessionStorage.setItem('userToken', JSON.stringify(user))
    }



    if (params.requested === 'true') {
      history.goBack();
    } else {
      history.push('/dashboard');
    }
  }

  function handleInvalidLogin() {
    console.log('asdfasdf')
    setErrorMessage('Login invalido');

    document.querySelectorAll<HTMLInputElement>('.login-form input').forEach((el, index) => {
      if (index === 0) {
        el.focus()
      }

      el.className = '';
      el.value = '';
    })

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

  function handleRememberMeClick() {
    setRememberMe(!rememberMe);
  }

  if (loading) {
    return (
      <div id="page-login"></div>
    )
  }

  return (
    <div id="page-login">
      <Panel />

      <div className='login-container'>
        <div className="back-button" onClick={handleBackClick}>
          <FiArrowLeft color='#15C3D6' size="24" />
        </div>

        <form className='login-form' onSubmit={handleSubmit}>
          <fieldset>
            <legend>Fazer Login</legend>

            <div className="input-block">
              <label>E-mail</label>
              <input
                id='email'
                className={isEmailValid ? 'valid' : ''}
                value={email}
                onChange={event => setEmail(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label>Senha</label>
              <input
                id='password'
                type='password'
                className={isPasswordValid ? 'valid' : ''}
                value={password}
                onChange={event => setPassword(event.target.value)}
              />
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

        <Link className='link-new-account' to='/new-account'>Não tem uma conta?</Link>

        <p className='error-message'>{errorMessage}</p>
      </div>
    </div>
  )
}

export default Login