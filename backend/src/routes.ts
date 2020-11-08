import { Router } from 'express';
import multer from 'multer';

import OrphanagesController from './controllers/OrphanagesController';
import UsersController from './controllers/UsersController';

import uploadConfig from './config/upload';

import { verifyJWT } from './utils';
import User from './models/User';

const routes = Router();
const upload = multer(uploadConfig);

// Rotas de orfanatos
routes.get('/orphanages', OrphanagesController.index)
routes.get('/orphanages/:id', OrphanagesController.show);
routes.post('/orphanages', upload.array('images'), OrphanagesController.create);

// Rotas de Usuários
routes.get('/users', UsersController.index);
routes.post('/users/create', UsersController.create);
routes.post('/users/login', UsersController.login);

routes.get('/users/teste', verifyJWT, UsersController.testRoute);

export default routes;