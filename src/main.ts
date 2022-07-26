import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform.interceptor';
import {
  NestjsWinstonLoggerService, 
  appendRequestIdToLogger, 
  appendIdToRequest, 
  LoggingInterceptor,
  morganRequestLogger,
  morganResponseLogger
 } from 'nestjs-winston-logger';
 import { logger } from './utils/logger';

 import { format, transports } from "winston";

 const globalLogger = new NestjsWinstonLoggerService({
  format: format.combine(
    format.timestamp({ format: "isoDateTime" }),
    format.json(),
    format.colorize({ all: true }),
  ),
  transports: [
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log" }),
    new transports.Console(),
  ],
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(globalLogger);
  app.use(appendIdToRequest);
  app.use(appendRequestIdToLogger(globalLogger))
  app.use(morganRequestLogger(globalLogger));
  app.use(morganResponseLogger(globalLogger))
  app.useGlobalInterceptors(new LoggingInterceptor(globalLogger));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
