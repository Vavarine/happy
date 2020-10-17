import React from 'react';
import { BrowserRouter, Route, Switch  } from 'react-router-dom';

import Landing from './pages/Landing';
import OrphanagesMap from './pages/OrphanagesMap';

// Switch faz com que apenas uma rota seja mostrada por vez

function Routes() {
   return(
      <BrowserRouter>
         <Switch> 
            <Route path="/" exact component={Landing} />
            <Route path="/app" component={OrphanagesMap} />
         </Switch>
      </BrowserRouter>
   );
}

export default Routes;
