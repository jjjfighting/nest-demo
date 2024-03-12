import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwt: JwtService) {}
  async singin(username: string, password: string) {
    const user = await this.userService.find(username);

    if (user && user.password === password) {
      // 生成token
      return this.jwt.signAsync({
        username: user.username,
        sub: user.id,
      });
    }
    throw new UnauthorizedException();
  }

  async singup(username: string, password: string) {
    const res = await this.userService.create({
      username,
      password,
    } as any);
    return res;
  }
}
