import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class CreateUserPipe implements PipeTransform {
  transform(value: CreateUserDto, metadata: ArgumentMetadata) {
    console.log('value: ', value);
    console.log('metadata: ', metadata);
    //   return { username: '123'}
    return value;
  }
}
