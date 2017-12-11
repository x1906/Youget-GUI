
// import os from 'os';
import forEach from 'lodash.foreach';
import { app } from 'electron';

const settings = {
  execute: 'you-get',
  charset: 'UTF-8',
  // 用户下载目录
  dir: app.getPath('downloads'),
  // 代理
  proxy: '',
};

export default settings;

/**
 * 更新配置
 * @param {*} options 更新配置
 */
export function updateSettings(options) {
  forEach(options, (value, key) => {
    settings[key] = value;
  });
}

/**
 * 保存配置到文件
 */
export function saveSettings() {
  console.log(settings);
}
