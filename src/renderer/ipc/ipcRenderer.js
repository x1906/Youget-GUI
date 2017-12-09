import { ipcRenderer } from 'electron';
import * as ipc from '../../utils/ipc-types';

/**
 * 查询下载数据详情
 * @param {* Function} callbak 回调函数 返回事件对象 和 数据
 */
export function info(callbak) {
  ipcRenderer.on(ipc.INFO_REPLY, (event, data) => {
    callbak(event, data);
  });
}

/**
 * 选择保存目录
 */
export function selectDirectory() {
  return ipcRenderer.sendSync(ipc.DIR);
}
