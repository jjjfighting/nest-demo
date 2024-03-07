import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Logs } from 'src/logs/logs.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
  ) {}
  findAll(query: any) {
    const { limit = 10, page, username, gender, role } = query;
    // 联合查询
    // SELECT * FROM user u LEFT JOIN profile p ON u.id = p.uid LEFT JOIN role r ON u.id = r.uid WHERE...

    return (
      this.userRepository
        .createQueryBuilder('user')
        // inner join  vs  left join  vs  outer join
        .leftJoinAndSelect('user.profile', 'profile')
        .leftJoinAndSelect('user.roles', 'roles')
        .where(username ? 'user.username = :username' : '1=1', { username })
        .andWhere(gender ? 'profile.gender = :gender' : '1=1', { gender })
        .andWhere(role ? 'roles.id = :id' : '1=1', { id: role })
        .skip((page - 1) * limit)
        .limit(limit)
        .getMany()
    );

    // return this.userRepository.find({
    //   // left join  或者inner join ， 总之：联查
    //   relations: ['roles', 'profile'],
    //   // 返回结构体勾选
    //   select: {
    //     id: true,
    //     username: true,
    //     profile: {
    //       gender: true,
    //     },
    //   },
    //   // 条件
    //   where: {
    //     username,
    //     profile: {
    //       gender,
    //     },
    //     roles: {
    //       id: role,
    //     },
    //   },
    //   take: limit,
    //   skip: (page - 1) * limit,
    // });
  }
  find(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }
  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }
  async create(user: User) {
    const userTmp = await this.userRepository.create(user);
    try {
      const res = this.userRepository.save(userTmp);
      return res;
    } catch (error) {
      console.log(222);
      console.log('e-----: ', error);
      throw new HttpException(error, 500);
    }
  }
  async update(id: number, user: Partial<User>) {
    return this.userRepository.update(id, user);
  }
  remove(id: number) {
    return this.userRepository.delete(id);
  }
  findProfile(id: number) {
    return this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        profile: true,
      },
    });
  }
  async findUserLogs(id: number) {
    const usrTmp = await this.findOne(id);
    console.log('usrTmp: ', usrTmp);
    return this.logsRepository.find({
      where: {
        user: usrTmp,
      },
      relations: {
        user: true,
      },
    });
  }
  async findLogsByGroup(id: number) {
    // SELECT logs.result as result, COUNT(logs.result) as count from logs,
    // user WHERE user.id = logs.userId AND user.id = 2 GROUP BY logs.result;
    return (
      this.logsRepository
        .createQueryBuilder('logs')
        // 选择logs里面的result字段，重命名为result
        .select('logs.result', 'result')
        .addSelect('COUNT("logs.result")', 'count')
        // leftJoinAndSelect 联查， 通过Mapping关系，把当前logs对应的user找出来，并添加上
        .leftJoinAndSelect('logs.user', 'user')
        .where('user.id=:id', { id })
        .groupBy('logs.result')
        .orderBy('result', 'DESC')
        // entities 或 raw results。 大多数情况下，你只需要从数据库中选择真实实体，例如 users。
        // 为此，你可以使用getOne和getMany。 但有时你需要选择一些特定的数据，比方说所有sum of all user photos。
        // 此数据不是实体，它称为原始数据。 要获取原始数据，请使用getRawOne和getRawMany
        .getRawMany()
    );
  }
}
