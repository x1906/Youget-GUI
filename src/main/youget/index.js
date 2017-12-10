
import { spawn, execFile } from 'child_process';
import settings from '../utils/settings';
import * as handle from './utils';
const iconv = require('iconv-lite');


export const info = (url, success, error) => {
  execFile(`${settings.execute}`, ['-i', `${url}`], { encoding: settings.charset }, (err, stdout) => {
    if (err) {
      error(err.message);
      return;
    }
    success(handle.info(stdout));
  });
};

export const download = (command, success, error) => {
  const youget = spawn('cmd.exe', ['/c', command]);
  youget.stdout.on('data', (data) => {
    success(iconv.decode(new Buffer(data), settings.charset));
  });
  youget.stderr.on('data', (data) => {
    error(iconv.decode(new Buffer(data), settings.charset));
  });
  youget.on('exit', (code, signal) => {
    console.log(`子进程退出码：${code} signal:${signal}`);
  });
  return youget;
};
