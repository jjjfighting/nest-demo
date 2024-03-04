import {
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  LoggerService,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';
// import { Logger } from 'nestjs-pino';
// import { ConfigEnum } from 'src/enum/config.enum';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    // @Inject(Logger) private readonly logger: LoggerService,
    private logger: Logger,
  ) {
    // 等价于 this.userService = new UserService();
    this.logger.log('user Controller init');
  }

  @Get()
  getUsers(): any {
    this.logger.log('getuser  请求成功');
    this.logger.warn('getuser  请求成功');
    this.logger.error('getuser  请求成功');

    return this.userService.findAll();
  }

  @Post()
  addUser(): any {
    console.log(123);
    const user = { username: 'jjj', password: '123456' } as User;
    return this.userService.create(user);
  }

  @Patch()
  updateUser(): any {
    const user = { username: 'sdf' } as User;
    return this.userService.update(1, user);
  }

  @Delete()
  deleteUser(): any {
    return this.userService.remove(1);
  }

  @Get('/profile')
  getUserProfile(): any {
    return this.userService.findProfile(2);
  }

  @Get('/logs')
  getUserLogs(): any {
    return this.userService.findUserLogs(2);
  }
  @Get('/logsByGroup')
  async getLogsByGroup(): Promise<any> {
    const res = await this.userService.findLogsByGroup(2);
    return res;
    // return res.map((i) => ({
    //   result: i.result,
    //   count: i.count,
    // }));
  }
}
