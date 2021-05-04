import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../users/entities';
import { Permission } from '../types';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column('text', { array: true })
  permissions: Permission[];

  @ManyToMany(() => User, user => user.groups)
  @JoinTable()
  users?: User[];
}
