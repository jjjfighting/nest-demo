import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Headers,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  LoggerService,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { CreateUserPipe } from './pipe/create-user/pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
// import { Logger } from 'nestjs-pino';
// import { ConfigEnum } from 'src/enum/config.enum';

@Controller('user')
@UseFilters(new TypeormFilter())
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
  // CreateUserPipe 管道：负责转换
  // CreateUserDto  类验证器： 负责验证，校验
  addUser(@Body(CreateUserPipe) dto: CreateUserDto): any {
    console.log('dto: ', dto);
    console.log(123);
    const user = dto;
    return this.userService.create(user as any);
  }

  @Get('/profile')
  @UseGuards(AuthGuard('jwt')) // 跑这个接口，需要验证jwt逻辑.  跳转jwt.strategy.ts文件
  getUserProfile(@Query('id', ParseIntPipe) id: any): any {
    // console.log('query: ', query);
    return this.userService.findProfile(id);
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
  updateUser(
    @Body() dto: any,
    @Param('id') id: number,
    @Headers('Authorization') headers: any,
  ): any {
    console.log('headers: ', headers);
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
