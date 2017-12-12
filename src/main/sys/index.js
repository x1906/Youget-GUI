import forEach from 'lodash.foreach';
import ipcExit from '../ipc/ipcMain';
import * as history from './history';
import * as status from '../../utils/status';
// import uuid from 'node-uuid';

const DATA = [];
const JSON_DATA = {};

const doSave = () => {
  if (DATA.length > 0) {
    history.saveHistory(DATA);
  }
};

export function cache(data, uid) {
  if (JSON_DATA[uid]) {
    const ret = JSON_DATA[uid];
    forEach(data, (value, key) => {
      ret[key] = value;
    });
  } else {
    JSON_DATA[uid] = data;
    DATA.push(data);
  }
}

export function startup() {
  const data = history.readHistory();
  data.forEach((item) => {
    // if (!item.uid) {
    //   // 如果没有uuid 给生成一个
    //   item.uid = uuid.v1();
    // }
    if (!JSON_DATA[item.uid]) {
      DATA.push(item);
      JSON_DATA[item.uid] = item;
    }
  });
  return data;
}

export function save() {
  doSave();
}

export function exit() {
  ipcExit();
  forEach(JSON_DATA, (value) => {
    if (value.status === status.DOING) {
      value.status = status.PAUSE;
    }
  });
  doSave();
}

