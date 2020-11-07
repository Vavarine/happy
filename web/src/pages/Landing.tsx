import React from "react";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

import '../styles/pages/landing.css';

import logoImg from '../images/logo.svg';

function Landing() {
   return (
      <div id="page-landing">
         <div className="content-wrapper">

            <div className="logo-container">
               <img src={logoImg} alt="Happy" />
               <div className="location">
                  <strong>Mauá</strong>
                  <span>São Paulo</span>
               </div>
            </div>

            <main>
               <h1>Leve felicidade para o mundo</h1>
               <p>Visite orfanatos e mude o dia de muitas crianças.</p>
            </main>

            <Link className="enter-restrict" to="/login">
               Sua área
            </Link>

            <Link className="enter-app" to="/app">
               <FiArrowRight size={30} color="#8D734B" />
            </Link>
         </div>
      </div>
   );
}

export default Landing
