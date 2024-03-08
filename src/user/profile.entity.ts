import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gender: number;

  @Column()
  photo: string;

  @Column()
  address: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  //   @JoinColumn() // 默认会设置为user+User的主键，并且是小驼峰： userId
  @JoinColumn({ name: 'user_id' })
  user: User;
}
