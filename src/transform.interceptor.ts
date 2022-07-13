/* eslint-disable prettier/prettier */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import {instanceToPlain} from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// export interface Response<T> {
//   data: T;
// }

@Injectable()
export class TransformInterceptor
  implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ) {
    return next.handle().pipe(map((data) => instanceToPlain( data )));
  }
}
