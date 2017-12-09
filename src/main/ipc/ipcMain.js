import { ipcMain } from 'electron';
import * as ipc from '../../utils/ipc-types';
import * as youget from '../youget';

/**
 * 存储当前下载进程
 */
const processMaps = {};

ipcMain.on(ipc.INFO, (event, message) => {
  youget.info(message, (data) => {
    event.send(ipc.INFO_REPLY, data);
  });
});

ipcMain.on(ipc.DOWNLOAD, (event, message) => {
  const download = youget.download(message, (data) => {
    event.send(ipc.DOWNLOAD_REPLY, data);
  });
  processMaps[download.pid] = download;
});
