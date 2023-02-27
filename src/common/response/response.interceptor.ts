import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

interface Response<T> {
  statusCode: number;
  data: T
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse<Response<T>>();

        return {
          statusCode: response.statusCode,
          data
        };
      })
    );
  }
}
