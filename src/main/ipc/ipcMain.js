import { ipcMain } from 'electron';
import kill from 'tree-kill';
import * as ipc from '../../utils/ipc-types';
import settings from '../utils/settings';
import * as handle from '../youget/handle';
import * as youget from '../youget';
import R from './ipcResult';
import * as status from '../../utils/status';

/**
 * 存储当前下载进程 键为 uid
 */
const processMaps = {};

// const maxCount = 10;

ipcMain.on(ipc.INFO, (event, url) => {
  youget.info(url, (data) => {
    event.sender.send(ipc.INFO_REPLY, R.ok(data));
    // event.returnValue = data;
  }, (error) => {
    event.sender.send(ipc.INFO_REPLY, R.err(error.message));
  });
});

ipcMain.on(ipc.DOWNLOAD, (event, url, uid, options) => {
  options.dir = options.dir || settings.dir;
  const download = youget.download(url, options);
  processMaps[uid] = download; // 将download进程存储到缓存对象中
  // let count = maxCount; // 计数器  初始化maxCount 首次必返回
  // 成功监听
  download.stdout.on('data', (data) => {
    // count += 1;
    // 100 次返回一次
    // if (count > maxCount) {
    // count = 0;
    const result = handle.download(data, options.dir);
    if (result) {
      event.sender.send(ipc.DOWNLOAD_REPLY, R.ok(result, uid));
    }
    // }
  });

  // 异常监听
  download.stderr.on('data', (data) => {
    let ret;
    if (Buffer.isBuffer(data)) {
      ret = data.toString(settings.charset);
    } else {
      ret = data;
    }
    event.sender.send(ipc.DOWNLOAD_REPLY, R.err({
      status: status.ERROR,
      errorMessage: ret,
    }, uid));
  });
  // 进程结束
  download.on('exit', (code, signal) => {
    // 此处优先进程结束标志位 放在前面判断
    console.log(`子进程退出码：${code} signal:${signal}`);
    if (signal === 'SIGHUP') {
      // 进程结束 说明用户手动暂停了下载
      event.sender.send(ipc.PAUSE_REPLY, R.ok(status.PAUSE, uid));
    } else if (code === 0) {
      // code === 0 是正常退出 说明下载完成
      event.sender.send(ipc.DOWNLOAD_REPLY, R.ok({
        status: status.DONE,
      }, uid));
    } else if (code === 1) {
      // code === 1 异常中断 (结束任务)
      event.sender.send(ipc.DOWNLOAD_REPLY, R.ok({
        status: status.ERROR,
        errorMessage: `异常中断下载 进程退出 code:${code}`,
      }, uid));
    } else {
      // 如果下载进程没有结束标志
      console.log(`子进程退出码：${code} signal:${signal}`);
    }
    delete processMaps[uid];
  });
});

// 暂停下载
ipcMain.on(ipc.PAUSE, (event, uid) => {
  if (processMaps[uid]) {
    const childProcess = processMaps[uid];
    if (!childProcess.killed) {
      kill(childProcess.pid, 'SIGKILL');
    }
  }
});
