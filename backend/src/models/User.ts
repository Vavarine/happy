import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import Orphanage from './Orphanage';

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  newPasswordToken: string;

  @OneToMany(() => Orphanage, orphanage => orphanage.user, {
    cascade: ['insert', 'update']
  })

  @JoinColumn({ name: 'user_id' })
  orphanages: Orphanage[]
}