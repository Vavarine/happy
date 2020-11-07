import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Landing from './pages/Landing';
import OrphanagesMap from './pages/OrphanagesMap';
import CreateOephanage from './pages/CreateOrphanage';
import Orphanage from './pages/Orphanage';
import Login from './pages/Login';
import RedefinePassword from './pages/RedefinePassword';
import NewPassword from './pages/NewPassword';

// Switch faz com que apenas uma rota seja mostrada por vez

function Routes() {
   return (
      <BrowserRouter>
         <Switch>
            <Route path="/" exact component={Landing} />
            <Route path="/app" component={OrphanagesMap} />

            <Route path="/orphanages/create" component={CreateOephanage} />
            <Route path="/orphanages/:id" component={Orphanage} />

            <Route path="/login" component={Login} />
            <Route path="/redefine-password" component={RedefinePassword} />
            <Route path="/new-password" component={NewPassword} />
         </Switch>
      </BrowserRouter>
   );
}

export default Routes;
