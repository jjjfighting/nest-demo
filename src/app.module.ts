import { Global, Logger, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Configuration from './configuration';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigEnum } from './enum/config.enum';
import { User } from './user/user.entity';
import { Logs } from './logs/logs.entity';
import { Profile } from './user/profile.entity';
import { Roles } from './roles/roles.entity';
import { join } from 'path';
import { LoggerModule } from 'nestjs-pino';
import { LogsModule } from './logs/logs.module';
import { connectionParams } from '../ormconfig';
import * as dotenv from 'dotenv';

const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,

      // ignoreEnvFile: false, // 读取配置。 false时读取env    true时读取load内容， 既是config.yml内容
      load: [() => dotenv.config({ path: 'env' })],
    }),
    TypeOrmModule.forRoot(connectionParams),

    UserModule,
    LogsModule,
    // 日志插件  pino。   懒人适用。   线上使用winston更好
    // LoggerModule.forRoot({
    //   pinoHttp: {
    // }),
  ],
  controllers: [],
  providers: [Logger],
  exports: [Logger],
})
export class AppModule {}
