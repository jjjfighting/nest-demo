import { Logs } from 'src/logs/logs.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Roles } from 'src/roles/roles.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  // typescript -> 数据库  关系关联  Mapping。   并没有注入外键
  @OneToMany(() => Logs, (logs) => logs.user)
  logs: Logs[];

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  @ManyToMany(() => Roles, (roles) => roles.users)
  @JoinTable({ name: 'users_roles' }) // 多对多要用Table，建立中间表, 生成一个users_roles的中间表
  roles: Roles[];
}
