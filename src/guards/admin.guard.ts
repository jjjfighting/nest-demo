import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    console.log('req: ', req);

    const user = await this.userService.find(req.user.username);
    console.log('user: -----', user);
    // 后续操作： 根据user的roles，决定能否访问  或者其他逻辑
    return true;
  }
}
