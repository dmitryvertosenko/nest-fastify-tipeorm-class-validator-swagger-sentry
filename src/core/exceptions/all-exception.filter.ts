import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ResponseBody } from '../types/response-body.interface';
import { HttpExeptionBody } from '../types/http-exception-body.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: Error | HttpException, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const context = host.switchToHttp();
    const request = context.getRequest();

    const bodyParsed = request.raw._readableState.buffer?.tail?.data;

    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody: ResponseBody = {
      message: exception instanceof HttpException ? exception.message : 'Something went wrong!',
      meta: {
        path: request.url,
        headers: request.headers,
        params: Object.keys(request?.params).length ? request.params : undefined,
        body: bodyParsed ? JSON.parse(Buffer.from(bodyParsed).toString()) : undefined,
        error: !(exception instanceof HttpException)
          ? {
              message: exception.message,
              stack: exception.stack,
            }
          : {
              message: (exception as unknown as HttpExeptionBody).response.error,
              stack: (exception as unknown as HttpExeptionBody).response.message,
            },
      },
      data: null,
    };

    httpAdapter.reply(context.getResponse(), responseBody, httpStatus);
  }
}
