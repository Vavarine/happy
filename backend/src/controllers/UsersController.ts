import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { WriteError } from 'typeorm'
import bcrypt from "bcrypt";
import * as yup from 'yup';
import jwt from 'jsonwebtoken';

import User from '../models/User';

export default {
  async index(req: Request, res: Response) {
    const usersRepository = getRepository(User);
    const users = await usersRepository.find();

    return res.status(201).send(users);
  },

  async create(req: Request, res: Response) {
    const usersRepository = getRepository(User);
    const saltRounds = 10;

    const schema = yup.object().shape({
      name: yup.string().required().max(100),
      email: yup.string().required().max(100),
      password: yup.string().required().max(100)
    })

    await schema.validate(req.body, {
      abortEarly: false,
    })

    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
      const user = usersRepository.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      });

      usersRepository.save(user).then(data => {
        return res.status(201).send(data);
      }).catch(err => {
        if (err.code === "SQLITE_CONSTRAINT") {
          return res.status(400).send('Email já cadastrado');
        } else {
          return res.status(500).send(err.code);
        }
      })

    })
  },

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const usersRepository = getRepository(User);

    const user = await usersRepository.findOneOrFail({ email });

    bcrypt.compare(password, user.password, (err, result) => {
      const { id } = user;

      if (result) {
        var token = jwt.sign({ id }, process.env.SECRET as string, {
          expiresIn: 300 // expires in 5min
        });

        return res.json({ auth: true, token: token });
      } else {
        res.status(401).json({ message: "Login inválido" })
      }
    });
  },

  async testRoute(req: Request, res: Response) {
    res.status(200).json({ message: 'Usuario tem acesso' })
  }
}