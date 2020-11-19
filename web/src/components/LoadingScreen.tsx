import React, { useEffect } from 'react';
import MoonLoader from 'react-spinners/MoonLoader'

import '../styles/components/loadingScreen.css';

interface LoadingScreenProps {
  backgroundColor?: string
}

const LoadingScreen: React.FC<LoadingScreenProps> = (props) => {
  useEffect(() => {
    if (props.backgroundColor) {
      document.getElementById('loading-screen')!.style.backgroundColor = props.backgroundColor;
    }
  }, [props])


  return (
    <div id='loading-screen'>
      <div className='loading-spinner-box'>
        <MoonLoader size={40} color='#4D6F80' />
      </div>
    </div>
  );
}

export default LoadingScreen