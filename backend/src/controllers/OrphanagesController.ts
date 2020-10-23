import { Request, Response } from "express";
import { getRepository } from 'typeorm';
import * as yup from 'yup';

import Orphanage from '../models/Orphanage';
import orphanageView from '../views/orphanagesView';

export default {
   async index(req: Request, res: Response) {
      const orphanageRepository = getRepository(Orphanage);

      const orphanages = await orphanageRepository.find({ relations: ['images'] });

      return res.status(200).send(orphanages);
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
         open_on_weekends
      } = req.body;
   
      const orphanageRepository = getRepository(Orphanage);
  
      const reqFiles = req.files as Express.Multer.File[];
      const images = reqFiles.map(file => {
         return { path: file.filename }
      })

      const data = {
         name,   
         latitude,
         longitude,
         about,
         instructions,
         opening_hours,
         open_on_weekends,
         images
      }

      const schema = yup.object().shape({
         name: yup.string().required(),
         latitude: yup.number().required(),
         longitude: yup.number().required(),
         about: yup.string().required().max(300),
         opening_hours: yup.string().required(),
         open_on_weekends: yup.boolean().required(),
         images: yup.array(
            yup.object().shape({
               path: yup.string().required()
            })
         )
      });

      await schema.validate(data, {
         abortEarly: false,
      })
      
      const orphanage = orphanageRepository.create(data);
   
      await orphanageRepository.save(orphanage);
   
      return res.status(201).send(orphanageView.render(orphanage));
   }

}
