import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { createLogger } from 'winston';
import * as winston from 'winston';
import {
  WINSTON_MODULE_NEST_PROVIDER,
  WinstonModule,
  utilities,
} from 'nest-winston';
import 'winston-daily-rotate-file';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AllExceptionFilter } from './filters/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // 重构了nest的logger   后续： 抽出解耦，放在logs文件夹操作
    // logger,
  });
  app.setGlobalPrefix('api/v1');

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const httpAdapter = app.get(HttpAdapterHost);
  const logger = new Logger();
  // 全局Filter只能有一个
  // app.useGlobalFilters(new AllExceptionFilter(logger, httpAdapter));

  // 全局管道拦截器
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true,
    }),
  );

  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
