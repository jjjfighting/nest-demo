import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
// import { ConfigEnum } from 'src/enum/config.enum';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {
    // 等价于 this.userService = new UserService();
  }

  @Get()
  getUsers(): any {
    console.log(456);
    const data = this.configService.get('db');
    console.log('data: ', data);
    return this.userService.getUsers();
  }

  @Post()
  addUser(): any {
    console.log(123);
    return this.userService.addUser();
  }

  @Post()
  addHello(): any {
    return {
      code: 0,
    };
  }
}
