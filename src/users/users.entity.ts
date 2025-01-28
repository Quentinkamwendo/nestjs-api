// import { Items } from 'src/items/entities/item.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  // OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Users')
export class Users {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // @OneToMany(() => Items, (item) => item.user)
  // item: Items[];
}
