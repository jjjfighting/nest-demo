import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  LoggerService,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
// import { Logger } from 'nestjs-pino';
// import { ConfigEnum } from 'src/enum/config.enum';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    // @Inject(Logger) private readonly logger: LoggerService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    // 等价于 this.userService = new UserService();
    this.logger.log('user Controller init');
  }

  @Get()
  getUsers(@Query() query: any): any {
    console.log('query: ', query);
    // page 页码 limit 每页条数 condition-查询条件（username、role、gender等
    // throw new HttpException('拒绝访问', HttpStatus.FORBIDDEN);
    this.logger.log('getuser  请求成功');
    this.logger.warn('getuser  请求成功');
    this.logger.error('getuser  请求成功');

    return this.userService.findAll(query);
  }

  @Post()
  addUser(@Body() dto: any): any {
    console.log('dto: ', dto);
    console.log(123);
    const user = dto as User;
    return this.userService.create(user);
  }

  @Get('/profile')
  getUserProfile(@Query() query: any): any {
    console.log('query: ', query);
    return this.userService.findProfile(2);
  }

  @Get('/:id')
  getUser(@Param('id') id: number): any {
    // console.log('dto: ', dto);
    // throw new HttpException('拒绝访问', HttpStatus.FORBIDDEN);
    this.logger.log('getuser  请求成功');
    this.logger.warn('getuser  请求成功');
    this.logger.error('getuser  请求成功');

    return this.userService.findOne(id);
  }

  @Patch('/:id')
  updateUser(@Body() dto: any, @Param('id') id: number): any {
    console.log('dto: ', dto);
    console.log('id: ', id);
    // const user = { username: 'sdf' } as User;
    return this.userService.update(id, dto);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: number): any {
    return this.userService.remove(id);
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
