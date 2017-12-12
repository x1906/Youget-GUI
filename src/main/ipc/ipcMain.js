import { ipcMain } from 'electron';
import forEach from 'lodash.foreach';
import kill from 'tree-kill';
import * as ipc from '../../utils/ipc-types';
import settings from '../utils/settings';
import * as handle from '../youget/handle';
import * as youget from '../youget';
import R from './ipcResult';
import * as status from '../../utils/status';
import * as sys from '../sys';

/**
 * 存储当前下载进程 键为 uid
 */
const processMaps = {};
let running = true;

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
  sys.cache({ url, uid }, uid);
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
      sys.cache(result, uid);
      if (running) {
        event.sender.send(ipc.DOWNLOAD_REPLY, R.ok(result, uid));
      }
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
    sys.cache({ status: status.ERROR, errorMessage: ret }, uid);
    event.sender.send(ipc.DOWNLOAD_REPLY, R.err({
      status: status.ERROR,
      errorMessage: ret,
    }, uid));
  });
  // 进程结束
  download.on('exit', (code, signal) => {
    // 此处优先进程结束标志位 放在前面判断
    console.log(`子进程退出码：${code} signal:${signal}`);
    if (code === 1) {
      // code === 1 暂停下载
      sys.cache({ status: status.PAUSE }, uid);
      if (running) {
        event.sender.send(ipc.DOWNLOAD_REPLY, R.ok({
          status: status.PAUSE,
          // errorMessage: `异常中断下载 进程退出 code:${code}`,
        }, uid));
        // sys.save();
      }
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

ipcMain.on(ipc.STARTUP, (event) => {
  console.log('readHistory 获取下载');
  event.returnValue = sys.startup();
});

/**
 * 退出所有线程
 */
export default function exit() {
  running = false;
  if (processMaps) {
    forEach(processMaps, (value) => {
      if (value.pid) {
        kill(value.pid, 'SIGKILL');
      }
    });
  }
}
