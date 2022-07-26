import { NestjsWinstonLoggerService } from 'nestjs-winston-logger';
 //import { format, transports } from "winston";
import { createLogger, format, transports } from 'winston';
import rTracer from 'cls-rtracer';
import path from 'path';
import fs from 'fs';
import Module from 'module';
//const debug = require('node-forge/lib/debug');

const { combine, timestamp, label, printf, json, colorize } = format;

const getLogLabel = (callingModule: any) => {
  const parts = callingModule.filename.split(path.sep);
  return path.join(parts[parts.length - 2], parts.pop());
};

const formatDate = () => {
  let d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return `${year}${month}${day}`;
};

const getFile = (type: string) => {
  const d = formatDate();
  const filename = `logs/${d}${type}.log`;
  fs.open(filename, 'r', function (err, fd) {
    if (err) {
      fs.writeFile(filename, '', function (err) {
        if (err) {
          return `logs/${type}.log`;
        }
        return filename;
      });
    } else {
      return filename;
    }
  });
  return filename;
};

/**
 * Creates a Winston logger object.
 * ### Log Format
 * *| timestamp | request-id | module/filename | log level | log message |*
 *
 * @param {Module} callingModule the module from which the logger is called
 */
export const logger = (callingModule: Module) =>
  new NestjsWinstonLoggerService({
    format: combine(
      colorize({all: true}),
      label({ label: getLogLabel(callingModule) }),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      json(),
      printf((info) => {
        const rid = rTracer.id();

        return rid
          ? `| ${info.timestamp} | ${rid} | ${info.label} | ${info.message} |`
          : `| ${info.timestamp} | ${info.label} | ${info.message} |`;
      }),
    ),
    transports: [
      new transports.Console(),
      new transports.File({
        filename: getFile('info'),
        level: 'info',
      }),
      new transports.File({
        filename: getFile('error'),
        level: 'error',
      }),
    ],
    exitOnError: false,
  });

//export default logger;
