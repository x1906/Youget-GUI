import fs from 'fs';
import { app } from 'electron';
import Youget from '../core/Youget';
import IPCController from './IPCController';
import logger from './Logger';

/**
 * YougetGUI
 * 程序主体 后端代码启动都在此类的构造函数中
 */
export default class YougetGUI {
  constructor() {
    this.config = {
      execute: 'you-get',
      encoding: 'UTF-8',
      videoDir: app.getPath('downloads'),
      proxy: '',
    };
    this.download = new Youget(this.config);
    this.ipc = new IPCController(this.download);

    process.on('uncaughtException', (err) => { // 监听未捕获的异常
      logger.error(err);
    });
  }

  saveConfig(config) {
    const json = JSON.stringify(config);
    fs.writeFileSync(this.CONFIG_FILE_NAME, json, { encoding: 'utf-8' });
  }

  exit() {
    this.download.exit();
    console.log('退出程序');
  }
}
