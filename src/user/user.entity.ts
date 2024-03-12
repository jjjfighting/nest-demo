import { Logs } from 'src/logs/logs.entity';
import {
  AfterInsert,
  AfterRemove,
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
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  // typescript -> 数据库  关系关联  Mapping。   并没有注入外键
  @OneToMany(() => Logs, (logs) => logs.user)
  logs: Logs[];

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile: Profile;

  @ManyToMany(() => Roles, (roles) => roles.users, { cascade: true })
  @JoinTable({ name: 'users_roles' }) // 多对多要用Table，建立中间表, 生成一个users_roles的中间表
  roles: Roles[];

  @AfterInsert()
  afterInsert() {
    console.log('hahahahah', this.id, this.username);
  }

  @AfterRemove()
  afterRemove() {
    console.log('hahahahah2222222');
  }
}
