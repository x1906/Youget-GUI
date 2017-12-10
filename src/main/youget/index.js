
import { spawn, execFile } from 'child_process';
import settings from '../utils/settings';
import * as handle from './handle';
const iconv = require('iconv-lite');


export const info = (url, success, error) => {
  // exec(`${settings.execute} '-i' ${url}`, { encoding: 'UTF-8' }, (err, stdout, stderr) => {
  execFile(`${settings.execute}`, ['-i', `${url}`], { encoding: settings.charset }, (err, stdout, stderr) => {
    if (err) {
      error(err);
      return;
    }
    if (stderr) {
      console.log(stderr);
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
