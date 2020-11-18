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
routes.post('/orphanages', verifyJWT, upload.array('images'), OrphanagesController.create);

// Rotas de Usuários
routes.get('/users', UsersController.index);
routes.get('/users/orphanages/:id', UsersController.showUserOrphanages);
routes.post('/users/create', UsersController.create);

// Rotas de autenticação
routes.post('/users/login', UsersController.login);
routes.get('/users/auth', verifyJWT, UsersController.authToken);

// Rotas de redefinição de senha
routes.post('/users/update-password', UsersController.newPasswordToken);
routes.get('/users/update-password/auth-token', UsersController.authNewPasswordToken);
routes.put('/users/update-password/', UsersController.updatePassword);

export default routes;