import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ApiProperty } from '@nestjs/swagger';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

export class SuccessResponse<T> {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  error: boolean;

  data: T;

  @ApiProperty()
  count: number | null;
}

@Injectable()
export class SuccessResponseInterceptor<T>
  implements NestInterceptor<T, SuccessResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponse<T>> {
    const httpContext: HttpArgumentsHost = context.switchToHttp();
    const response = httpContext.getResponse();
    return next.handle().pipe(
      map((data) => {
        return {
          timestamp: new Date(),
          statusCode: response.statusCode,
          error: false,
          message: data.message ?? null,
          count: data.count ?? null,
          totalCount: data.totalCount ?? null,
          data: data.data ?? null,
        };
      }),
    );
  }
}
