import settings from '../utils/settings';
import * as status from '../../utils/status';

const tags = [{
  regx: /site:.*/g,
  set: (data, str) => {
    data.site = str.replace(/\s*site:\s*/, '').trim();
  },
}, {
  regx: /title:.*/g,
  set: (data, str) => {
    data.title = str.replace(/\s*title:\s*/, '').trim();
  },
}];

const listTags = [{
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
}];

const startRegx = /Downloading.*\.\.\./;
const startReplaceRegx = /Downloading\s+/;
const downloadRegx = /├.*\]\s*/g;

/**
 * 显示详情解析
 * @param {String} data 待解析数据
 */
export function info(data) {
  const result = {
    list: [],
  };

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

/**
 * 下载进度/详情 解析
 * @param {Buffer|String} data 待解析数据
 * @param {String} dir 当前文件保存目录
 */
export function download(data, dir) {
  let ret;
  if (Buffer.isBuffer(data)) {
    ret = data.toString(settings.charset);
  } else {
    ret = data;
  }
  if (startRegx.test(ret)) {
    const result = {};
    if (/site:.*/.test(ret)) {
      // 处理site
      const site = /site:.*/.exec(ret)[0];
      result.site = site.replace(/\s*site:\s*/, '');
    }
    // 开始下载
    const name = startRegx.exec(ret)[0];
    result.name = name.replace(startReplaceRegx, '').replace('...', '').trim();
    result.path = `${dir}\\${result.name}`;
    return result;
  } else if (downloadRegx.test(ret)) {
    // 下载中
    ret = ret.replace(downloadRegx, '').replace('(', '|').replace(')', '|').replace('%', '');
    const arr = ret.split('|');
    return {
      status: status.DOING,
      progress: arr[0].trim(),
      size: arr[1].trim(),
      speed: arr[2].trim(),
    };
  } else if (ret.indexOf('Merged') > -1) {
    return {
      status: status.DONE,
    };
  }
  return null;
}
