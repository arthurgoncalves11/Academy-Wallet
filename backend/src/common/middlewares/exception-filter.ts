import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const response: Response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof UnprocessableEntityException) {
      const exceptionResponse = exception.getResponse() as {
        message: string;
        errors: any;
      };

      const responseBody = {
        statusCode: 422,
        message: exceptionResponse.message || 'Erro de validação',
        errors: exceptionResponse.errors || [],
        error: true,
        ...(process.env.NODE_ENV !== 'prd' && { stacktrace: exception.stack }),
      };

      return response.status(422).json(responseBody);
    }

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const message = exception.message || 'Internal server error';

    const responseMessage = {
      statusCode: status,
      message,
      error: true,
    };
    if (process.env.NODE_ENV !== 'prd') {
      responseMessage['stacktrace'] = exception.stack;
    }

    return response.status(status).json(responseMessage);
  }
}
