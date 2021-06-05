import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, ManyToMany } from 'typeorm';
import { Group } from '../../groups/entities';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column({ select: false })
  password: string;

  @Column()
  age: number;

  @DeleteDateColumn({ select: false })
  deletedAt?: Date;

  @ManyToMany(() => Group, group => group.users)
  groups?: Group[];
}
