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

const maxCount = 10;

ipcMain.on(ipc.INFO, (event, url) => {
  youget.info(url, (data) => {
    event.sender.send(ipc.INFO_REPLY, R.ok(data));
    // event.returnValue = data;
  }, (error) => {
    event.sender.send(ipc.INFO_REPLY, R.err(error.message));
  });
});

ipcMain.on(ipc.DOWNLOAD, (event, url, options) => {
  options.dir = options.dir || settings.dir;
  const download = youget.download(url, options);
  processMaps[download.pid] = download;
  let count = maxCount; // 计数器  初始化maxCount 首次必返回
  // 成功监听
  download.stdout.on('data', (data) => {
    count += 1;
    // 100 次返回一次
    const result = handle.download(data, options.dir);
    if (result) {
      if (result.status === 'Finish' || result.progress === '100') {
        event.sender.send(ipc.DOWNLOAD_REPLY, R.ok(result, url, download.pid));
      } else if (count > maxCount) {
        count = 0;
        event.sender.send(ipc.DOWNLOAD_REPLY, R.ok(result, url, download.pid));
      }
    }
  });

  // 异常监听
  download.stderr.on('data', (data) => {
    if (Buffer.isBuffer(data)) {
      event.sender.send(ipc.DOWNLOAD_REPLY,
        R.err(data.toString(settings.charset), url, download.pid));
    } else {
      event.sender.send(ipc.DOWNLOAD_REPLY, R.err(data, url, download.pid));
    }
  });
  // 进程结束
  download.on('exit', (code, signal) => {
    console.log(`子进程退出码：${code} signal:${signal}`);
  });
});
