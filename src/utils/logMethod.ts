import fs from 'fs';
import rTracer from 'cls-rtracer';
import path from 'path';

export const formatDate = () => {
    let d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
  
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
  
    return `${year}${month}${day}`;
  };

  export const getLogLabel = (callingModule:any) => {
    const parts = callingModule.filename.split(path.sep);
    return path.join(parts[parts.length - 2], parts.pop());
  };

export const getFile = (type: string) => {
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