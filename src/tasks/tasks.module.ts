import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { NestjsWinstonLoggerModule } from "nestjs-winston-logger";
import { format, transports } from "winston";
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import rTracer from 'cls-rtracer';
import {getFile} from '../utils/logMethod';
import { randomUUID } from 'crypto';


const { combine, timestamp, json, colorize, printf, label } = format;

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    TypeOrmModule.forFeature([TaskRepository]),
    NestjsWinstonLoggerModule.forRoot({
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss'}),
        label({ label: `new Date()` }),
        json(),
        colorize({all: true}),
        printf((info) => {
          const rid = randomUUID();
  
          return rid
            ? `| ${info.timestamp} | ${rid} | ${info.label} | ${info.message} |`
            : `| ${info.timestamp} | ${info.label} | ${info.message} |`;
        
        }),
      ),
      transports: [
        //new transports.File({ filename: "error.log", level: "error" }),
        new transports.Console(),
        new transports.File({
        filename: "info.log", //getFile('info'),
        level: 'info',
        }),
        new transports.File({
        filename: "error.log", //getFile('error'),
        level: 'error',
        }),
      ]
    })
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
