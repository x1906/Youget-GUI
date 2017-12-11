import { execFile, spawn } from 'child_process';
import settings from '../utils/settings';
import * as handle from './handle';
// const iconv = require('iconv-lite');

/**
 * 查询视频详情信息
 * @param {String} url 视频地址
 * @param {Function} success 查询成功回调
 * @param {Function} error 查询失败回调
 */
export const info = (url, success, error) => {
  // exec(`${settings.execute} '-i' ${url}`, { encoding: 'UTF-8' }, (err, stdout, stderr) => {
  execFile(settings.execute, ['-i', `${url}`], { encoding: settings.charset }, (err, stdout, stderr) => {
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

/**
 * 下载文件
 * @param {String} url 下载地址
 * @param {*} options 下载配置项
 * @returns 返回ChildProcess 类的实例(子进程对象)
 */
export const download = (url, options) => {
  // 设置下载目录
  const args = ['-o', options.dir, options.downloadWith || ''];
  // You may specify an HTTP proxy
  if (settings.proxy) {
    args.push('-x');
    args.push(settings.proxy);
  }
  // To enforce re-downloading
  if (options.force) {
    args.push('-f');
  }
  // 设置下载地址
  args.push(url);
  const youget = spawn(settings.execute, args);
  return youget;
};
