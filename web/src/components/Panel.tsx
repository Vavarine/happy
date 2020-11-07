import React from 'react';

import '../styles/components/panel.css';

import logotipoImg from '../images/logotipo.svg';
import { Link } from 'react-router-dom';

export default function () {
  return (
    <div className="panel">
      <div className="content-wrapper">
        <Link to='/'>
          <img src={logotipoImg} className="logo" alt='logo' />
        </Link>

        <div className="location">
          <strong>Mauá</strong>
          <span>São Paulo</span>
        </div>

      </div>
    </div>
  )
}