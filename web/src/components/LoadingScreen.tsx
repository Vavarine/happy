import React from 'react';

import '../styles/components/sidebar.css';

import AnimatedLogo from '../images/animate-logo.svg';

export default function LoadingScreen() {
  return (
    <div id='loading-screen'>
      <img src={AnimatedLogo} />
    </div>
  );
}
