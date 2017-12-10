// import 'es6-shim';

export function info(data) {
  const result = {
    list: [],
  };
  let isList = false;
  let index = -1;
  let obj = {};
  data.trim().split('\n').forEach((element) => {
    // console.log(element);
    const line = element.trim();
    if (!isList) {
      if (line.startsWith('site:')) {
        result.site = line.replace('site:', '').trim();
      } else if (line.startsWith('title:')) {
        result.title = line.replace('title:', '').trim();
      } else if (line.startsWith('streams:')) {
        isList = true;
      }
    } else if (line.startsWith('- format:') || '- itag:') {
      if (index >= result.list.length) {
        result.list.push(obj);
        obj = {};
      }
      index += 1;
      obj.format = line.replace('- format:', '').trim();
    } else if (line.startsWith('container:')) {
      obj.container = line.replace('container:', '').trim();
    } else if (line.startsWith('video-profile:')) {
      obj.video_profile = line.replace('video-profile:', '').trim();
    } else if (line.startsWith('size:')) {
      obj.size = line.replace('size:', '').trim();
    } else if (line.startsWith('m3u8_url:')) {
      obj.m3u8_url = line.replace('m3u8_url:', '').trim();
      // } else if (line.startsWith('# download-with:')) {
      //   obj.download_with = line.replace('# download-with:', '').trim();
    }
  });
  return result;
}

export function download() {

}
