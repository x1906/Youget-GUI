import Download from './Download';
import logger from '../sys/Logger';
import * as status from '../../utils/status';
// import * as status from '../../utils/status';


const infoRegx = {
  tags: [{
    regx: /site:.*/g,
    set: (data, str) => {
      data.site = str.replace(/\s*site:\s*/, '').trim();
    },
  }, {
    regx: /title:.*/g,
    set: (data, str) => {
      data.title = str.replace(/\s*title:\s*/, '').trim();
    },
  }],
  list: [{
    regx: /- format:.*/g,
    set: (data, str) => {
      data.format = str.replace(/\s*- format:\s*/, '').trim();
      data.downloadWith = `--format=${data.format}`;
    },
  }, {
    regx: /- itag:.*/g,
    set: (data, str) => {
      // alias /- format:.*/g
      data.format = str.replace(/\s*- itag:\s*/, '').trim();
      data.downloadWith = `--itags=${data.format}`;
    },
  }, {
    regx: /quality:.*/g,
    set: (data, str) => {
      data.quality = str.replace(/\s*quality:\s*/, '').trim();
    },
  }, {
    regx: /container:.*/g,
    set: (data, str) => {
      data.container = str.replace(/\s*container:\s*/, '').trim();
    },
  }, {
    regx: /video-profile:.*/g,
    set: (data, str) => {
      data.videoProfile = str.replace(/\s*video-profile:\s*/, '').trim();
    },
  }, {
    regx: /size:.*/g,
    set: (data, str) => {
      data.size = str.replace(/\s*size:\s*/, '').trim();
    },
  }],
};

const startRegx = /Downloading.*\.\.\./;
const startReplaceRegx = /Downloading\s+/;
const downloadRegx = /├.*\]\s*/g;

/**
 * you-get 下载实现类
 */
export default class Youget extends Download {
  /**
   * @param {Array} 配置项
   */
  constructor(config) {
    super(config);
    this.type = 'Youget';
  }
  /**
   * 查看详情
   * @param {String} url 视频网址
   * @param {Function} callback 回调函数
   */
  info(url, callback) {
    const $this = this;
    super.createSpawn(null, ['-i', url],
      (data) => { // 成功回调
        const result = $this.ok(Youget.handleInfo(data));
        if ($this.running) { // 如果程序正在运行 则返回数据
          callback(result);
        }
      },
      (error) => { // 错误回调
        logger.error(error);
        if ($this.running) { // 如果程序正在运行 则返回数据
          callback($this.err(error.toString()));
        }
      });
  }

  /**
   * 新建下载 或者 重新下载
   *
   * 如果data 里没有uid 视为新下载 会重新生成uid 并添加到 super.records中
   * @param {String} url 视频地址
   * @param {*} options 下载配置项 dir,downloadWith,force
   * @param {*} record
   * @param {Function} callback 回调函数
   */
  download(url, options, record, callback) {
    const $this = this;
    const config = this.config;
    record.dir = record.dir || options.dir || config.videoDir;
    const uid = record.uid || super.add(record); // 如果有uid 说明不是新增的
    const dw = options.downloadWith || ''; // 下载指定类型
    const args = ['-o', record.dir, dw];
    // You may specify an HTTP proxy
    if (config.proxy) {
      args.push('-x');
      args.push(config.proxy);
    }
    // To enforce re-downloading 强制重新下载
    if (options.force) {
      args.push('-f');
    }
    args.push(url);
    super.createSpawn(uid, args,
      (data) => { // 成功 success
        const result = $this.ok(Youget.handleDownload(data, options.dir), uid);
        if ($this.running) {
          callback(result);
        }
      },
      (error) => { // 失败 error
        logger.info(error);
        const result = $this.err({ status: status.ERROR, errorMessage: error.toString() });
        if ($this.running) {
          callback(result);
        }
      }, // exit
      (code, signal) => { // 异常结束 下载完成
        if (code === 1) { // code === 1 暂停下载
          // sys.cache({ status: status.PAUSE }, uid);
          const result = $this.ok({ status: status.PAUSE }, uid);
          if ($this.running) {
            callback(result);
          }
        } else {
          // 如果下载进程没有结束标志
          console.log(`子进程退出码：${code} signal:${signal}`);
        }
        if ($this.running) {
          $this.removeOnlyProcess(uid);
        }
      },
    );

    return uid;
  }

  /**
   * youget -i 格式化成JSON
   * @param {String} data 字符串
   */
  static handleInfo(data) {
    const result = {
      list: [],
    };
    // console.log(this.type);
    const tags = infoRegx.tags;
    const listTags = infoRegx.list;

    tags.forEach((tag) => {
      let temp = tag.regx.exec(data);
      while (temp !== null) {
        tag.set(result, temp[0]);
        temp = tag.regx.exec(data);
      }
    });

    listTags.forEach((tag) => {
      let temp = tag.regx.exec(data);
      let index = 0;
      while (temp !== null) {
        if (!result.list[index]) {
          result.list.push({});
        }
        tag.set(result.list[index], temp[0]);
        index += 1;
        temp = tag.regx.exec(data);
      }
    });
    return result;
  }

  static handleDownload(data) {
    if (startRegx.test(data)) {
      const result = {};
      if (/site:.*/.test(data)) {
        // 处理site
        const site = /site:.*/.exec(data)[0];
        result.site = site.replace(/\s*site:\s*/, '');
      }
      // 开始下载
      const name = startRegx.exec(data)[0];
      result.name = name.replace(startReplaceRegx, '').replace('...', '').trim();
      return result;
    } else if (downloadRegx.test(data)) {
      // 下载中
      const ret = data.replace(downloadRegx, '').replace('(', '|').replace(')', '|').replace('%', '');
      const arr = ret.split('|');
      return {
        status: status.DOING,
        progress: arr[0].trim(),
        size: arr[1].trim(),
        speed: arr[2].trim(),
      };
    } else if (data.indexOf('Merged') > -1) {
      return {
        status: status.DONE,
      };
    }
    return null;
  }
}
