import forEach from 'lodash.foreach';
import { spawn } from 'child_process';
import uuid from 'node-uuid';
import fs from 'fs';
import kill from 'tree-kill';
import { Buffer } from 'buffer';
import * as status from '../../utils/status';

/**
 * 核心下载类
 * 管理下载记录 下载进程
 */
export default class Download {
  /**
   * @param {*} config 配置项
   */
  constructor(config) {
    this.running = true; // 是否运行标志
    this.config = config;
    this.records = this.read();
    // 下载线程;
    this.process = {};
    this.json = {};
    this.records.forEach((item) => {
      this.json[item.uid] = item;
    });
  }

  FILE_NAME = 'download.json';
  CONFIG_FILE_NAME = 'app.conf'

  /**
   * 添加下载记录
   * @param {*} data
   */
  add(record) {
    const uid = uuid.v1();
    record.uid = uid;
    this.json[uid] = record;
    this.records.push(record);
    return uid;
  }
  /**
   * 更新下载记录
   * @param {*} data
   * @param {String} uid
   */
  update(data, uid) {
    const ret = this.json[uid];
    forEach(data, (value, key) => {
      ret[key] = value;
    });
  }
  /**
   * 仅仅删除进程记录
   * @param {String} uid 全局uid
   */
  removeOnlyProcess(uid) {
    delete this.process[uid];
  }
  /**
   * 删除下载记录
   * @param {String} uid 全局uid
   * @param {Boolean} removeFile 是否删除文件
   */
  remove(uid, removeFile) {
    if (this.process[uid]) {
      const childProcess = this.process[uid];
      if (childProcess.pid) { // 删除下载记录 退出下载线程
        kill(childProcess.pid);
      }
    }
    // const ret = this.json[uid];
    if (removeFile) { // 删除文件
      // fs.unlinkSync()
    }
    delete this.json[uid];
    let index = -1;
    for (let i = 0, len = this.records.length; i < len; i += 1) {
      if (this.records[i].uid === uid) {
        index = i;
        break;
      }
    }
    if (index > -1) { // 删除数组内的数据
      this.records = this.records.splice(index, 1);
    }
  }

  /**
   * 保存
   * @param {Array} records 下载记录
   */
  save(records) {
    const json = JSON.stringify(records);
    fs.writeFileSync(this.FILE_NAME, json, { encoding: 'utf-8' });
  }

  read() {
    if (fs.existsSync(this.FILE_NAME)) {
      const json = fs.readFileSync(this.FILE_NAME, { encoding: 'utf-8' });
      return JSON.parse(json);
    }
    return [];
  }

  getRecords() {
    return this.records;
  }
  getConfig() {
    return this.config;
  }

  /**
   * 创建一个异步进程
   * @param {String} uid 唯一ID
   * @param {Array} args 字符串参数列表
   * @param {Function} success 成功回调
   * @param {Function} error 失败回调
   * @param {Function} exit 退出回调
   * @param {*} options # http://nodejs.cn/api/child_process.html#child_process_child_process_spawn_command_args_options
   */
  createSpawn(uid, args, success, error, exit, options) {
    if (!options) options = {};
    options.encoding = options.encoding || this.config.encoding;
    const childProcess = spawn(this.config.execute, args, options);
    if (uid) { // 如有有 uid 才记录此线程
      this.process[uid] = childProcess;
    }
    childProcess.stdout.on('data', (data) => {
      if (Buffer.isBuffer(data)) {
        success(data.toString());
      } else {
        success(data);
      }
    });

    childProcess.stderr.on('data', (data) => {
      error(data);
    });

    childProcess.on('exit', (code, signal) => {
      console.log(`子进程退出码：${code} signal:${signal}`);
      if (exit && exit instanceof Function) { // 可以没有退出回调
        exit(code, signal);
      }
    });
  }

  /**
   * 暂停下载
   * @param {String} uid 全局id
   */
  pause(uid) {
    if (this.process[uid]) {
      const childProcess = this.process[uid];
      if (!childProcess.killed) {
        kill(childProcess.pid, 'SIGKILL');
        delete this.process[uid];
      }
    }
  }

  /**
   * 退出下载
   */
  exit() {
    this.running = false;
    if (this.process) {
      forEach(this.process, (value) => {
        if (value.pid) { // 杀死下载进程
          kill(value.pid, 'SIGKILL');
        }
      });
    }
    this.records.forEach((item) => { // 退出 将所有在下载的置暂停
      if (item.status === status.DOING) {
        item.status = status.PAUSE;
      }
    });
    this.save(this.records);
  }
  /**
   * 成功返回, 如果有uid 会更新后台记录
   * @param {*} data 返回数据
   * @param {String} uid 记录uid
   */
  ok(data, uid) {
    if (uid) this.update(data, uid);
    return {
      uid,
      status: true,
      data,
    };
  }
  /**
  * 错误返回, 如果有uid 会更新后台记录
  * @param {*} data 返回数据
  * @param {String} uid 记录uid
  */
  err(data, uid) {
    if (uid) this.update(data, uid);
    return {
      uid,
      status: false,
      data,
    };
  }
}
