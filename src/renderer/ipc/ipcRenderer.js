import { ipcRenderer } from 'electron';
import * as ipc from '../../utils/ipc-types';

/**
 * 弃用 用Promise 后端同步调用
 * 查询下载数据详情
 * @param {* Function} callback 回调函数 返回事件对象 和 数据
 */
export function initInfoBack(callback) {
  ipcRenderer.removeAllListeners(ipc.INFO_REPLY); // 先移除监听, 防止重复注册
  ipcRenderer.on(ipc.INFO_REPLY, (event, data) => {
    callback(data);
  });
}

/**
 * 发送查询数据
 * @param {* String} url 视频地址
 */
export function sendInfo(url) {
  ipcRenderer.send(ipc.INFO, url);
}

/**
 * 新建下载
 * @param {* String} url 下载地址
 * @param {* Object} options 下载配置项
 */
export function download(url, options) {
  ipcRenderer.send(ipc.DOWNLOAD, url, options);
}

export function initDownloadBack(callback) {
  ipcRenderer.removeAllListeners(ipc.DOWNLOAD_REPLY); // 先移除监听, 防止重复注册
  ipcRenderer.on(ipc.DOWNLOAD_REPLY, (event, data) => {
    callback(data);
  });
}
/**
 * 选择保存目录
 */
export function selectDirectory() {
  return ipcRenderer.sendSync(ipc.DIR);
}
