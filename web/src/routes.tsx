import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Landing from './pages/Landing';
import OrphanagesMap from './pages/OrphanagesMap';
import CreateOephanage from './pages/CreateOrphanage';
import Orphanage from './pages/Orphanage';
import Login from './pages/Login';
import RedefinePassword from './pages/RedefinePassword';
import NewPassword from './pages/NewPassword';
import NewAccount from './pages/NewAccount';
import Dashboard from './pages/Dashboard';
import DeleteOrphanage from './pages/DeleteOrphanage';
import EditOrphanage from './pages/EditOrphanage';
import ValidateOrphanage from './pages/ValidateOrphanage';

// Switch faz com que apenas uma rota seja mostrada por vez

function Routes() {
   return (
      <BrowserRouter>
         <Switch>
            <Route path="/" exact component={Landing} />
            <Route path="/app" component={OrphanagesMap} />

            <Route path="/orphanages/create" exact component={CreateOephanage} />
            <Route path="/orphanages/:id" exact component={Orphanage} />
            <Route path="/orphanages/delete/:orphanageId" exact component={DeleteOrphanage} />
            <Route path="/orphanages/validate/:orphanageId" exact component={ValidateOrphanage} />

            <Route path="/orphanages/edit/:orphanageId" exact component={EditOrphanage} />

            <Route path="/login/:requested?" component={Login} />
            <Route path="/redefine-password" exact component={RedefinePassword} />
            <Route path="/redefine-password/:newPasswordToken" component={NewPassword} />

            <Route path="/new-account" component={NewAccount} />

            <Route path="/dashboard" component={Dashboard} />
         </Switch>
      </BrowserRouter>
   );
}

export default Routes;
