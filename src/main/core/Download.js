import forEach from 'lodash.foreach';
import { spawn } from 'child_process';
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
    this.records = new Map();
    const local = this.read();
    debugger;
    this.count = 0;
    if (local) {
      local.forEach((record) => {
        this.count += 1; // 重新生成uid
        this.records.set(this.count, record);
      }, this);
    }
    // 下载线程;
    this.process = new Map();
  }

  FILE_NAME = 'download.json';
  CONFIG_FILE_NAME = 'app.conf'

  /**
   * 添加下载记录
   * @param {*} data
   */
  add(record) {
    this.count += 1;
    const uid = this.count;
    record.uid = uid;
    this.records.set(uid, record);
    return uid;
  }
  /**
   * 更新下载记录
   * @param {*} data
   * @param {Number} uid
   */
  update(data, uid) {
    if (this.records.has(uid)) {
      const reocrd = this.records.get(uid);
      if (data.status === status.EXIST) { // 下载已存在 清除
        this.records.delete(uid);
      } else {
        forEach(data, (value, key) => {
          reocrd[key] = value;
        });
      }
    }
  }
  /**
   * 仅仅删除进程记录
   * @param {Number} uid 全局uid
   */
  removeOnlyProcess(uid) { // 子进程异常退出时
    this.process.delete(uid);
  }
  /**
   * 删除下载记录
   * @param {Array<Number>} uids 全局uid
   * @param {Boolean} removeFile 是否删除文件
   */
  remove(uids, removeFile) {
    this.kill(uids);
    uids.forEach((uid) => {
      if (this.records.has(uid)) {
        const record = this.records.get(uid);
        const path = `${record.dir}\\${record.name}`;
        if (removeFile) { // 删除文件
          fs.unlinkSync(path);
        }
        this.records.delete(uid);
      }
    }, this);
    return true;
  }

  /**
   * 暂停下载
   * @param {Array<Number>} uids 全局id
   */
  pause(uids) {
    uids.forEach((uid) => {
      this.kill(uid);
    });
  }

  /**
   * 保存
   * @param {Map<Number,{}}>} records 下载记录
   */
  save(records) {
    const data = [];
    records.forEach((value) => {
      data.push(value);
    });
    if (data.length > 0) { // 对数据进行排序
      data.sort((a, b) => a.uid - b.uid);
    }
    fs.writeFileSync(this.FILE_NAME, JSON.stringify(data), { encoding: 'utf-8' });
  }

  read() {
    if (fs.existsSync(this.FILE_NAME)) {
      const json = fs.readFileSync(this.FILE_NAME, { encoding: 'utf-8' });
      return JSON.parse(json);
    }
    return [];
  }

  getRecords() {
    const data = [];
    this.records.forEach((value) => {
      data.push(value);
    });
    return data.sort((a, b) => a.uid - b.uid);
    // return this.records;
  }
  getConfig() {
    return this.config;
  }

  /**
   * 创建一个异步进程
   * @param {Number} uid 唯一ID
   * @param {Array} args 字符串参数列表
   * @param {Function} success 成功回调
   * @param {Function} error 失败回调
   * @param {Function} exit 退出回调
   * @param {{}} options # http://nodejs.cn/api/child_process.html#child_process_child_process_spawn_command_args_options
   */
  createSpawn(uid, args, success, error, exit, options) {
    if (!options) options = {};
    options.encoding = options.encoding || this.config.encoding;
    const childProcess = spawn(this.config.execute, args, options);
    if (uid) { // 如有有 uid 才记录此线程
      this.process.set(uid, childProcess);
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
      if (exit && exit instanceof Function) { // 可以没有退出回调
        exit(code, signal);
      }
    });
  }
  /**
   * 杀死进程
   * @param {Number} uid 全局uid
   */
  kill(uid) {
    if (this.process.has(uid)) {
      const childProcess = this.process.get(uid);
      if (!childProcess.killed) {
        kill(childProcess.pid, 'SIGKILL');
        this.process.delete(uid);
      }
    }
  }
  /**
   * 退出下载
   */
  exit() {
    this.running = false;
    if (this.process) {
      this.process.forEach((value) => {
        if (value.pid) { // 杀死下载进程
          kill(value.pid, 'SIGKILL');
        }
      }, this);
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
   * @param {{}} data 返回数据
   * @param {Number} uid 记录uid
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
  * 错误返回
  * @param {String} message 返回消息
  * @param {Number} uid 记录uid
  */
  err(message, uid) {
    if (uid) this.update({ status: status.ERROR, message }, uid);
    return {
      uid,
      status: false,
      message,
    };
  }
}
