import { ipcMain } from 'electron';
import * as ipc from '../../utils/ipc-types';
import settings from '../utils/settings';
import * as handle from '../youget/handle';
import * as youget from '../youget';
import R from './ipcResult';

/**
 * 存储当前下载进程
 */
const processMaps = {};

ipcMain.on(ipc.INFO, (event, url) => {
  youget.info(url, (data) => {
    event.sender.send(ipc.INFO_REPLY, R.ok(data));
    // event.returnValue = data;
  }, (error) => {
    event.sender.send(ipc.INFO_REPLY, R.err(error.message));
  });
});

ipcMain.on(ipc.DOWNLOAD, (event, url, options) => {
  const download = youget.download(url, options);
  processMaps[download.pid] = download;
  // 成功监听
  download.stdout.on('data', (data) => {
    const result = handle.download(data, url, download.pid);
    if (result) event.sender.send(ipc.DOWNLOAD_REPLY, R.ok(result));
  });

  // 异常监听
  download.stderr.on('data', (data) => {
    if (Buffer.isBuffer(data)) {
      event.sender.send(ipc.DOWNLOAD_REPLY, R.err(data.toString(settings.charset), download.pid));
    } else {
      event.sender.send(ipc.DOWNLOAD_REPLY, R.err(data, download.pid));
    }
  });
  // 进程结束
  download.on('exit', (code, signal) => {
    console.log(`子进程退出码：${code} signal:${signal}`);
  });
});
