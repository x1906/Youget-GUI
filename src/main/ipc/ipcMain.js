import { ipcMain } from 'electron';
import * as ipc from '../../utils/ipc-types';
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

ipcMain.on(ipc.DOWNLOAD, (event, message) => {
  const download = youget.download(message, (data) => {
    event.sender.send(ipc.DOWNLOAD_REPLY, data);
  });
  processMaps[download.pid] = download;
});
