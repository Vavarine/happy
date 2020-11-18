import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import Image from './Image';
import User from './User';

@Entity('orphanages')
export default class Orphanage {
   @PrimaryGeneratedColumn()
   id: number;

   @Column()
   name: string;

   @Column()
   latitude: number;

   @Column()
   longitude: number;

   @Column()
   about: string;

   @Column()
   instructions: string;

   @Column()
   opening_hours: string;

   @Column()
   open_on_weekends: boolean;

   @Column()
   validated: boolean;

   @OneToMany(() => Image, image => image.orphanage, {
      cascade: ['insert', 'update']
   })

   @JoinColumn({ name: 'orphanage_id' })
   images: Image[];

   @ManyToOne(() => User, user => user.orphanages)

   @JoinColumn({ name: 'user_id' })
   user: User;
}