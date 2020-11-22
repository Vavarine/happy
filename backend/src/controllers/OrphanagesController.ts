import { Request, Response } from "express";
import { getRepository } from 'typeorm';
import * as yup from 'yup';

import Orphanage from '../models/Orphanage';
import User from "../models/User";
import Image from "../models/Image";
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
      const {
         id: userId,
         name,
         latitude,
         longitude,
         about,
         instructions,
         opening_hours,
         open_on_weekends,
      } = req.body;

      const {
         orphanageId,
      } = req.params;

      // Cria o repositório de images
      const imageRepository = getRepository(Image);

      // Busca no banco informações do usuário que rez o request
      const userRepository = getRepository(User);
      const user = await userRepository.findOneOrFail(userId);

      // Busca o orfanato a ser atualizado no banco
      const orphanageRepository = getRepository(Orphanage);
      const orphanage = await orphanageRepository.findOneOrFail(orphanageId, { relations: ['images', 'user'] });

      //console.log(orphanage);

      // compila as imagens vindas do request em 'images''
      const reqFiles = req.files as Express.Multer.File[];

      const images = reqFiles.map(file => {
         return { path: file.filename }
      })

      console.log(images)

      // Compila as informações do update em 'newOrphanage' para validação
      const newOrphanage = {
         name,
         latitude,
         longitude,
         about,
         instructions,
         opening_hours,
         open_on_weekends: open_on_weekends === 'true',
         validated: orphanage.validated,
      }

      console.log({ ...newOrphanage, images: images });

      // Cria esquema para validação
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
         ).required(),
      });

      // Faz a validação
      await schema.validate({ ...newOrphanage, images: images }, {
         abortEarly: false,
      })

      if (user.admin === true) {
         // Se o usuário for admin a atualização do orfanato é feita
         await orphanageRepository.update(orphanage.id, { ...newOrphanage });

         // Remove as novas imagens anteriores do orphanato e substitui pelas novas
         await imageRepository.delete({ orphanage: { id: orphanage.id } });

         //insere as novas imagens
         await (images.forEach(async image => {
            const img = imageRepository.create({
               path: image.path,
               orphanage: orphanage
            })

            await imageRepository.save(img);
         }))

         res.status(200).json({ message: 'Orphanage updated' });

      } else {

         // Verifica se o usuário tem altoria sobre o cadastro do orfanato
         if (orphanage.user.id === userId) {
            await orphanageRepository.update(orphanage.id, { ...newOrphanage });


            // Remove as novas imagens anteriores do orphanato e substitui pelas novas
            await imageRepository.delete({ orphanage: { id: orphanage.id } });

            //insere as novas imagens
            await (images.forEach(async image => {
               const img = imageRepository.create({
                  path: image.path,
                  orphanage: orphanage
               })

               await imageRepository.save(img);
            }))

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
         const orphanage = await orphanageRepository.findOneOrFail(orphanageId, { relations: ['user'] });

         if (orphanage.user.id === user.id) {
            await orphanageRepository.delete(orphanageId);
            res.status(200).json({ message: 'Orphanage deleted' });
         } else {
            res.status(401).json({ message: 'User unauthorized' });
         }

      }
   },

   async validate(req: Request, res: Response) {
      const { orphanageId } = req.params;
      const { id } = req.body;

      console.log('asdf');

      const userRepository = getRepository(User);
      const user = await userRepository.findOneOrFail(id);

      if (user.admin === true) {
         const orphanageRepository = getRepository(Orphanage);
         await orphanageRepository.update(orphanageId, { validated: true });

         res.status(200).json({ message: 'Orphanage validated' });
      } else {
         res.status(401).json({ message: 'Unauthorized' });
      }
   }
}
