
import { ipcMain } from 'electron';
import * as ipc from '../../utils/ipc-types';

export default class SettingsController {

  constructor(sys) {
    this.sys = sys;
    this.startup(); // 启动监听
  }

  startup() {
    const sys = this.sys;
    ipcMain.on(ipc.GET_CONFIG, (event) => {
      event.event.returnValue = sys.getConfig();
    });
  }
}
