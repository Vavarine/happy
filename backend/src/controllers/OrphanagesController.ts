import { Request, Response } from "express";
import { getRepository } from 'typeorm';
import * as yup from 'yup';

import Orphanage from '../models/Orphanage';
import User from "../models/User";
import orphanageView from '../views/orphanagesView';

export default {
   async index(req: Request, res: Response) {
      const orphanageRepository = getRepository(Orphanage);

      const orphanages = await orphanageRepository.find({ relations: ['images'] });

      return res.status(200).send(orphanageView.renderMany(orphanages));
   },

   async show(req: Request, res: Response) {
      const { id } = req.params;

      const orphanageRepository = getRepository(Orphanage);

      const orphanage = await orphanageRepository.findOneOrFail(id, {
         relations: ['images']
      });

      return res.status(200).send(orphanageView.render(orphanage));
   },

   async create(req: Request, res: Response) {
      const {
         name,
         latitude,
         longitude,
         about,
         instructions,
         opening_hours,
         open_on_weekends,
         id
      } = req.body;

      const orphanageRepository = getRepository(Orphanage);
      const userRepository = getRepository(User);

      const user = await userRepository.findOneOrFail(id);

      const reqFiles = req.files as Express.Multer.File[];
      const images = reqFiles.map(file => {
         return { path: file.filename }
      })

      let data = {
         name,
         latitude,
         longitude,
         about,
         instructions,
         opening_hours,
         open_on_weekends: open_on_weekends === 'true',
         images,
         validated: false,
         user
      }

      const schema = yup.object().shape({
         name: yup.string().required(),
         latitude: yup.number().required(),
         longitude: yup.number().required(),
         about: yup.string().required().max(300),
         instructions: yup.string().required().max(300),
         opening_hours: yup.string().required(),
         open_on_weekends: yup.boolean().required(),
         images: yup.array(
            yup.object().shape({
               path: yup.string().required()
            })
         ),
         user: yup.object({
            name: yup.string().required().max(100),
            email: yup.string().required().max(100),
            password: yup.string().required().max(100).min(6)
         })
      });

      await schema.validate(data, {
         abortEarly: false,
      })

      const orphanage = orphanageRepository.create(data);

      await orphanageRepository.save(orphanage);

      return res.status(201).send(orphanageView.render(orphanage));
   },

   async update(req: Request, res: Response) {
      const { orphanageId } = req.params;
      const { id: userId, newOrphanage } = req.body;

      // Busca usuário no banco
      const userRepository = getRepository(User);
      const user = await userRepository.findOneOrFail(userId);

      // Busca o orfanato a ser atualizado no banco
      const orphanageRepository = getRepository(Orphanage);
      const orphanage = await orphanageRepository.findOneOrFail(orphanageId);


      if (user.admin === true) {
         // Se o usuário for admin a atualização do orfanato é feita
         await orphanageRepository.update(orphanage.id, newOrphanage);
         res.status(200).json({ message: 'Orphanage updated' });

      } else {

         // Verifica se o usuário tem altoria sobre o cadastro do orfanato
         if (orphanage.user.id === user.id) {
            await orphanageRepository.update(orphanage.id, newOrphanage);
            res.status(200).json({ message: 'Orphanage updated' });
         } else {
            res.status(401).json({ message: 'User unauthorized' });
         }

      }
   },

   async delete(req: Request, res: Response) {
      const { orphanageId } = req.params;
      const { id: userId } = req.body;

      const userRepository = getRepository(User);
      const user = await userRepository.findOneOrFail(userId);

      const orphanageRepository = getRepository(Orphanage);

      if (user.admin === true) {

         await orphanageRepository.delete(orphanageId);
         res.status(200).json({ message: 'Orphanage deleted' });

      } else {
         const orphanage = await orphanageRepository.findOneOrFail(orphanageId);

         if (orphanage.user.id === user.id) {
            await orphanageRepository.delete(orphanageId);
            res.status(200).json({ message: 'Orphanage deleted' });
         } else {
            res.status(401).json({ message: 'User unauthorized' });
         }

      }
   }
}
