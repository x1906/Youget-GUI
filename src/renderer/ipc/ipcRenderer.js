import { ipcRenderer } from 'electron';
import * as ipc from '../../utils/ipc-types';

/**
 * 弃用 用Promise 后端同步调用
 * 查询下载数据详情
 * @param {* Function} callback 回调函数 返回事件对象 和 数据
 */
export function initInfo(callback) {
  ipcRenderer.removeAllListeners(ipc.INFO_REPLY);
  ipcRenderer.on(ipc.INFO_REPLY, (event, data) => {
    callback(data);
  });
}

/**
 * 发送查询数据
 * @param {* string} url 视频地址
 */
export function sendInfo(url) {
  // return new Promise((resolve) => {
  //   const data = ipcRenderer.sendSync(ipc.INFO, url);
  //   resolve(data);
  // });
  ipcRenderer.send(ipc.INFO, url);
}

/**
 * 选择保存目录
 */
export function selectDirectory() {
  return ipcRenderer.sendSync(ipc.DIR);
}
