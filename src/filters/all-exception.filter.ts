import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import * as requestIp from 'request-ip';

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
    const status = exception.getStatus();
    // console.log('exception: ', exception);

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
      error: exception['response'] || 'error',
    };

    this.logger.error(respBody);

    httpAdapter.reply(response, respBody);
  }
}
