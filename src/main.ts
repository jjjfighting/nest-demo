import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { createLogger } from 'winston';
import * as winston from 'winston';
import { WinstonModule, utilities } from 'nest-winston';
import 'winston-daily-rotate-file';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  // 使用winston日志插件
  const instance = createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          utilities.format.nestLike(),
        ),
      }),
      // 滚动写入日志
      new winston.transports.DailyRotateFile({
        level: 'warn',
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
      }),
    ],
  });

  const logger = WinstonModule.createLogger({
    instance,
  });

  const app = await NestFactory.create(AppModule, {
    // 重构了nest的logger
    logger,
  });
  app.setGlobalPrefix('api/v1');
  // 全局过滤器
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
