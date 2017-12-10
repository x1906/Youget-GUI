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
  },
}, {
  regx: /- itag:.*/g,
  set: (data, str) => {
    // alias /- format:.*/g
    data.format = str.replace(/\s*- itag:\s*/, '').trim();
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

export function download() {

}
