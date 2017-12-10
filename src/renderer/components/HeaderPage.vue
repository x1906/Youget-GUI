<template>
  <div class="app-header ">
    <ul class="f-left">
      <li class="active" @click="dialog.visibale = true">
        <i class="iconfont icon-jia"></i>
      </li>
      <li>
        <i class="iconfont icon-kaishi"></i>
      </li>
      <li>
        <i class="iconfont icon-zanting"></i>
      </li>
      <li>
        <i class="iconfont icon-shanchu"></i>
      </li>
      <li>
        <i class="iconfont icon-yidong"></i>
      </li>
    </ul>
    <ul class="f-right">
      <li>
        <i class="iconfont icon-menu"></i>
      </li>
      <li>
        <i class="iconfont icon-sousuo"></i>
      </li>
    </ul>

    <el-dialog title="新建下载" class="app-dialog" :visible.sync="dialog.visibale" :close-on-click-modal="dialog.modelClode" width="65%">
      <el-form>
        <el-form-item>
          <template slot="label" v-if="info.title">
            来源: {{info.site}} &emsp;文件名称:{{ info.title }}
          </template>
          <el-input v-model="form.url" @blur="sendInfo" placeholder="请输入下载视频网址">
            <template slot="append">
              <el-button :loading="dialog.loading" title="显示详情" @click="sendInfo">
                <i v-if="!dialog.loading" class="iconfont icon-xiangqing"></i>
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select :v-if="info.list" v-model="form.format" placeholder="请选择" style="width:100%;">
            <el-option v-for="item in info.list" :key="item.format" :label="item.video_profile +' '+ item.format" :value="item.format">
              <span style="float: left">{{ `${item.video_profile} (${item.format})` }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.size }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.visibale = false">取 消</el-button>
        <el-button type="primary" @click="doDownload">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import { sendInfo, initInfo } from '../ipc/ipcRenderer';

export default {
  mounted() {
    console.log('挂载 initInfo');
    initInfo(this.sendInfoBack);
  },
  data() {
    return {
      form: {
        url: 'http://v.youku.com/v_show/id_XMzIwMzkyMzYzMg==.html',
        info: {},
        format: '',
      },
      load: '',
      info: {},
      dialog: {
        loading: false,
        modelClode: false,
        visibale: false,
      },
    };
  },
  methods: {
    doDownload() {
      this.dialog.lodaing = false;
      this.info = {};
      this.dialog.visibale = true;
    },
    sendInfo() {
      // 如果当前正在查询 不执行
      if (this.dialog.loading || this.load === this.form.url) return;
      if (this.form.url) {
        this.dialog.loading = true;
        // console.log(`开始获取详情 ${this.dialog.loading}`);
        // const $this = this;
        // sendInfo(this.form.url).then((data) => {
        //   $this.info = data;
        //   $this.dialog.lodaing = false;
        //   console.log(`结束获取详情 ${this.dialog.lodaing}`);
        // });
        sendInfo(this.form.url);
      } else {
        Message({ type: 'warning', message: '请设置查询地址' });
      }
      // console.log(`方法结束获取详情 ${this.dialog.loading}`);
    },
    sendInfoBack(data) {
      this.info = data;
      this.load = this.form.url;
      if (data.list) {
        this.form.format = data.list[0].format;
      }
      this.dialog.loading = false;
      // console.log(`结束获取详情 ${this.dialog.loading}`);
    },
  },
};
</script>

<style scoped>
.app-header {
  background-color: #545c64;
  width: 100%;
  height: 100%;
}
.app-header ul {
  list-style: none;
  margin: 0;
  padding-left: 0;
}
.f-left li {
  float: left;
}
.f-right li {
  float: right;
}
.app-header ul li {
  color: #878d99;
  width: 56px;
  height: 60px;
  line-height: 60px;
  margin: 0;
  cursor: pointer;
  box-sizing: border-box;
  display: list-item;
  vertical-align: middle;
  text-align: center;
  border-bottom: 2px solid transparent;
}

.app-header ul li.active {
  color: rgb(255, 208, 75);
  border-bottom-color: rgb(255, 208, 75);
}
.app-header ul li:hover {
  background-color: rgb(67, 74, 80);
}
</style>
