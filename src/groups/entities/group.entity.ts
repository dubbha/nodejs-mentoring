import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../users/entities';
import { Permission } from '../enums';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column('enum', { enum: Permission, default: [Permission.READ], array: true })
  permissions: Permission[];

  @ManyToMany(() => User, user => user.groups)
  @JoinTable()
  users?: User[];
}
