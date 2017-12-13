import Download from './Download';

/**
 * youtube-dl 下载实现类
 */
export default class YoutubeDL extends Download {
  /**
   * @param {Array} 配置项
   */
  constructor(config) {
    super(config);
    this.type = 'youtube-dl';
  }

  info(url) {
    super.createSpawn(null, ['-i', url], (data) => {
      console.log(data);
    }, (data) => {
      console.log(data);
    });
  }
}
