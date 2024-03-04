import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false, // 读取配置。 false时读取env    true时读取load内容， 既是config.yml内容
      load: [Configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          type: 'mysql',
          host: configService.get(ConfigEnum.DB_HOST),
          port: configService.get(ConfigEnum.DB_PORT),
          username: configService.get(ConfigEnum.DB_USERNAME),
          password: configService.get(ConfigEnum.DB_PASSSWORD),
          database: configService.get(ConfigEnum.DB_DATABASE),
          entities: [User, Profile, Logs, Roles],
          logging: false,
          // 同步本地的schema与数据库   -》 初始化的时候去使用
          synchronize: true, // 直接根据entity生成对应表。建议开发时使用，生产时关闭
          // autoLoadEntities: true,
        } as TypeOrmModuleOptions),
    }),
    // 普通写法
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: 'example',
    //   database: 'testdb',
    //   entities: [],
    //   // 同步本地的schema与数据库   -》 初始化的时候去使用
    //   synchronize: true,
    //   logging: ['error'],
    // }),
    UserModule,
    // 日志插件  pino。   懒人适用。   线上使用winston更好
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          targets: [
            // pino-pretty 控制台输出日志美化格式
            {
              level: 'info',
              target: 'pino-pretty',
              options: {
                colorize: true,
              },
            },
            // pino-roll 按size大小，滚动输出日志到文件存储
            {
              level: 'info',
              target: 'pino-roll',
              options: {
                file: join('log', 'log.txt'),
                frequency: 'daily', // hourly
                size: '1m',
                mkdir: true,
              },
            },
          ],
        },
      },
      // process.env.NODE_ENV === 'development'
      //   ? {
      //       transport: {
      //         target: 'pino-pretty',
      //         options: {
      //           colorize: true,
      //         },
      //       },
      //     }
      //   : {
      //       transport: {
      //         target: 'pino-roll',
      //         options: {
      //           file: 'log.txt',
      //           frequency: 'daily',
      //           mkdir: true,
      //         },
      //       },
      //     },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
