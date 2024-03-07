import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import * as requestIp from 'request-ip';
import { QueryFailedError, TypeORMError } from 'typeorm';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private logger: LoggerService,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    // console.log('request: ', request);
    console.log('exception: ', exception);
    // const status = exception.getStatus();
    // console.log('exception: ', exception);

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let msg: string = exception['response'] || 'error';
    // 数据库方面报错
    if (exception instanceof QueryFailedError) {
      msg = exception.message;
    }

    const respBody = {
      headers: request.headers,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      query: request.query,
      body: request.body,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      params: request.params,
      timestamp: new Date().toISOString(),
      exception: exception['name'],
      error: msg,
      ip: requestIp.getClientIp(request),
    };

    this.logger.error(respBody);

    httpAdapter.reply(response, respBody, httpStatus);
  }
}
