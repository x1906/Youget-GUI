
import { exec, spawn } from 'child_process';
import { getExcuete } from '../utils/settings';
const iconv = require('iconv-lite');
const excute = getExcuete();

export const info = (url, success, error) => {
  exec(`${excute} --json ${url}`, (err, stdout) => {
    if (err) {
      error(iconv.decode(new Buffer(err), 'UTF-8'));
      return;
    }
    success(iconv.decode(new Buffer(stdout), 'UTF-8'));
  });
};

export const download = (command, success, error) => {
  const youget = spawn('cmd.exe', ['/c', command]);
  youget.stdout.on('data', (data) => {
    success(iconv.decode(new Buffer(data), 'UTF-8'));
  });
  youget.stderr.on('data', (data) => {
    error(iconv.decode(new Buffer(data), 'UTF-8'));
  });
  youget.on('exit', (code, signal) => {
    console.log(`子进程退出码：${code} signal:${signal}`);
  });
  return youget;
};
