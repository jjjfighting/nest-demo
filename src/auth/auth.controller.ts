import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SinginUserDto } from './dto/singin-ser.dto';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/singin')
  async singin(@Body() dto: SinginUserDto) {
    const token = await this.authService.singin(dto.username, dto.password);

    return {
      access_token: token,
    };
  }

  @Post('/singup')
  singup(@Body() dto: SinginUserDto) {
    // const
    return this.authService.singup(dto.username, dto.password);
  }
}
