import {
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  Unique,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({ name: 'customers' })
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ length: 100 })
  email: string;

  @Exclude()
  @Column({ length: 100, nullable: true })
  password: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    name: 'createdAt',
  })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({
    type: 'timestamp with time zone',
    name: 'updatedAt',
  })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({
    type: 'timestamp with time zone',
    name: 'deletedAt',
  })
  deletedAt: Date;
}
