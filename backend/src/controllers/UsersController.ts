import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { WriteError } from 'typeorm'
import bcrypt from "bcrypt";
import * as yup from 'yup';
import jwt from 'jsonwebtoken';

import User from '../models/User';

import sendNewPasswordTokenToEmail from '../utils/emailSender';
import usersView from '../views/usersView';

export default {
  async index(req: Request, res: Response) {
    const usersRepository = getRepository(User);
    const users = await usersRepository.find();

    return res.status(201).send(users);
  },

  async showUserOrphanages(req: Request, res: Response) {
    const { id } = req.params;

    const userRepository = getRepository(User);
    const user = await userRepository.findOneOrFail(id, { relations: ['orphanages', 'orphanages.images'] });

    return res.status(200).send(usersView.renderUserOrphanages(user))
  },

  async create(req: Request, res: Response) {
    const usersRepository = getRepository(User);
    const saltRounds = 10;

    const schema = yup.object().shape({
      name: yup.string().required().max(100),
      email: yup.string().required().max(100),
      password: yup.string().required().max(100).min(6)
    })

    await schema.validate(req.body, {
      abortEarly: false,
    })

    bcrypt.hash(req.body.password.replace(/(\r\n|\n|\r)/gm, ""), saltRounds, (err, hash) => {
      const user = usersRepository.create({
        name: req.body.name.replace(/(\r\n|\n|\r)/gm, ""),
        email: req.body.email.replace(/(\r\n|\n|\r)/gm, ""),
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

    const schema = yup.object().shape({
      email: yup.string().required().max(100),
      password: yup.string().required().max(100).min(6)
    })

    await schema.validate(req.body, {
      abortEarly: false,
    })

    const usersRepository = getRepository(User);

    const user = await usersRepository.findOneOrFail({ email });

    bcrypt.compare(password, user.password, (err, result) => {
      const { id } = user;

      if (result) {
        var token = jwt.sign({ id }, process.env.SECRET as string, {
          expiresIn: 10080 // expires in a week
        });

        return res.json({ auth: true, token: token });
      } else {
        res.status(401).json({ message: "Invalid login" })
      }
    });
  },

  async authToken(req: Request, res: Response) {
    const { id } = req.body;

    const userRepository = getRepository(User);

    await userRepository.findOneOrFail(id);

    res.status(200).json({ message: 'Valid', ...req.body })
  },

  async newPasswordToken(req: Request, res: Response) {
    const schema = yup.object().shape({
      email: yup.string().required().max(100),
    })

    await schema.validate(req.body, {
      abortEarly: false,
    })

    const usersRepository = getRepository(User);

    const user = await usersRepository.findOneOrFail({ email: req.body.email });

    var newPasswordToken = jwt.sign({ id: user.id }, process.env.SECRET as string, {
      expiresIn: 86400 // expires in a week
    });

    sendNewPasswordTokenToEmail(newPasswordToken, user.email);

    await usersRepository.update(user.id, { newPasswordToken });

    return res.status(200).json({ message: 'Success', newPasswordToken })
  },

  async authNewPasswordToken(req: Request, res: Response) {
    var token = req.headers['x-password-update-access-token'] as string;

    if (!token) return res.status(401).json({ message: 'No token provided.' });

    jwt.verify(token, process.env.SECRET as string, async function (err: any, decode: any) {
      if (err) return res.status(400).json({ message: 'Token is not valid' });

      const { id } = decode as any

      const usersRepository = getRepository(User);

      const user = await usersRepository.findOneOrFail(id);

      res.status(200).json({ userEmail: user.email, message: 'Token is valid' });
    })
  },

  async updatePassword(req: Request, res: Response) {
    const saltRounds = 10;
    var token = req.headers['x-password-update-access-token'] as string;

    const schema = yup.object().shape({
      newPassword: yup.string().required().min(6),
    })

    await schema.validate(req.body, {
      abortEarly: false,
    })

    if (!token) return res.status(401).json({ message: 'No token provided.' });

    const { newPassword } = req.body;

    // Verifica se o token é valido ao o decriptar
    jwt.verify(token, process.env.SECRET as string, async function (err: any, decode: any) {
      if (err) return res.status(400).json({ message: 'Token is not valid' });

      const { id } = decode as any

      const usersRepository = getRepository(User);

      const user = await usersRepository.findOneOrFail(id);

      if (user.newPasswordToken !== token) {
        return res.status(400).json({
          message: 'Token is not valid'
        });
      }

      bcrypt.hash(newPassword.replace(/(\r\n|\n|\r)/gm, ""), saltRounds, async (err, hash) => {

        await usersRepository.update(id, { password: hash, newPasswordToken: '' });

        res.status(200).json({ message: 'Password updated' });
      })

    })
  }
}