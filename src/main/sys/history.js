import fs from 'fs';

const historyFileName = `history.json`; // eslint-disable-line

/**
 * 读取本地存储的下载信息
 */
export function readHistory() {
  if (fs.existsSync(historyFileName)) {
    const json = fs.readFileSync(historyFileName, 'utf-8');
    return JSON.parse(json);
  }
  return [];
}

/**
 * 将下载信息保存到本地
 * @param {Array} history 下载记录
 */
export function saveHistory(history) {
  const json = JSON.stringify(history);
  fs.writeFileSync(historyFileName, json);
}
