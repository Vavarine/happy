import express from 'express';
import path from 'path';
import 'express-async-errors';
import cors from 'cors';
import dotEnv from 'dotenv';

dotEnv.config({
  path: process.env.NODE_ENV === "example" ? ".env.example" : ".env"
});

import './database/conection';
import routes from './routes';
import errorHandler from './errors/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(errorHandler);

app.listen(3333);
