import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonModule, WinstonModuleOptions, utilities } from 'nest-winston';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { Console } from 'winston/lib/winston/transports';

const consoleTransports = new Console({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    utilities.format.nestLike(),
  ),
});

const dailyTransports = new DailyRotateFile({
  level: 'info',
  // 指定目录
  dirname: 'logs',
  filename: 'application-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '10m',
  // 超过14天后，自动删除
  maxFiles: '14d',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple(),
  ),
});

@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          transports: [consoleTransports, dailyTransports],
        } as WinstonModuleOptions;
      },
    }),
  ],
})
export class LogsModule {}
