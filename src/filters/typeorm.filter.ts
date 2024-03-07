import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { QueryFailedError, TypeORMError } from 'typeorm';

// 抓取typeOrm的报错
@Catch(TypeORMError)
export class TypeormFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest<Request>();
    //   const status = exception.getStatus();

    //   this.logger.error(exception.message, exception.stack);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    let code = 500;
    if (exception instanceof QueryFailedError) {
      code = exception.driverError.errno;
    }
    console.log('code: ', code);
    response.status(500).json({
      code: code,
      timestamp: new Date().toISOString(),
    //   path: request.url,
    //   method: request.method,
      message: exception.message || HttpException.name,
    });
  }
}
