
import { ipcMain } from 'electron';
import * as ipc from '../../utils/ipc-types';

export default class IPCController {
  /**
   * 初始化ipc 控制器
   * @param {Youget|Youtubedl} download 下载器
   * @param {YougetGUI} sys 程序主体
   */
  constructor(download, sys) {
    this.download = download;
    this.sys = sys;
    this.startup(); // 启动监听
  }

  startup() {
    const download = this.download;
    // 查询详情监听
    ipcMain.on(ipc.INFO, (event, url) => {
      download.info(url, (data) => {
        event.sender.send(ipc.INFO_REPLY, data);
      });
    });

    ipcMain.on(ipc.SYNC_STARTUP, (event) => {
      event.returnValue = download.getRecords();
    });
    /**
     * 下载
     */
    ipcMain.on(ipc.SYNC_DOWNLOAD, (event, url, options, record) => {
      event.returnValue = download.download(url, options, record,
        (data) => {
          event.sender.send(ipc.DOWNLOAD_REPLY, data);
        });
    });

    /**
     * 暂停
     */
    ipcMain.on(ipc.PAUSE, (event, uid) => {
      download.pause(uid);
    });
  }
}
