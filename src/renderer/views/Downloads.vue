<template>
  <div>
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%;" :height="getHeight" current-row-key="uid" row-key="uid" :stripe="true" size="mini" :border="true" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="name" label="文件名" min-width="150">
      </el-table-column>
      <el-table-column label="状态" min-width="150">
        <template slot-scope="scope">
          <div style="width:100%; height:25px;">
            <span v-if="scope.row.status === 'Start'">等待数据...</span>
            <span v-if="scope.row.status === 'Pause'">暂停</span>
            <span v-if="scope.row.status === 'Done'">下载完成</span>
            <span v-if="scope.row.status === 'Doing'">{{ scope.row.speed }}</span>
            <span v-if="scope.row.status === 'Error'">下载出错</span>
          </div>
          <el-progress :percentage="parseFloat(scope.row.progress || '0')"></el-progress>
        </template>
      </el-table-column>
      <el-table-column prop="size" label="大小" min-width="80">
      </el-table-column>
      <el-table-column prop="site" label="来源" min-width="80">
      </el-table-column>
    </el-table>

    <!-- 新建下载弹出层 -->
    <el-dialog title="新建下载" class="app-dialog" :visible.sync="dialog.openSingle" :close-on-click-modal="true" width="65%" :before-close="closeDialog">
      <el-form>
        <el-form-item>
          <el-input v-model="form.url" placeholder="请输入下载视频网址">
            <template slot="append">
              <el-button :loading="dialog.loading" title="显示详情" @click="sendInfo">
                <i v-if="!dialog.loading" class="iconfont icon-xiangqing"></i>
              </el-button>
            </template>
          </el-input>
          <div v-if="info.title" class="download-title">
            <div class="download-left">来源: {{info.site}} &emsp;文件名称:&nbsp;</div>
            <div style="max-width:60%; overflow: hidden; text-overflow:ellipsis; white-space: nowrap;" v-bind:title="info.title">{{ info.title }}
            </div>
          </div>
          <el-select v-if="info.list" v-model="form.downloadWith" placeholder="请选择" style="width:100%; margin-top:5px;">
            <el-option v-for="item in info.list" :key="item.format" :label="(item.videoProfile || '') +' '+ item.format" :value="item.downloadWith">
              <span style="float: left;">{{ `${item.videoProfile || ''} (${item.format}) ${ !item.quality ? '' : '(' + item.quality + ')' }` }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.size || '' }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()">取 消</el-button>
        <el-button type="primary" @click="doDownload">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import uuid from 'node-uuid';
import { Message } from 'element-ui';
import forEach from 'lodash.foreach';
import * as service from '../ipc/ipcRenderer';
import bus from '../components/EventBus';
import * as status from '../../utils/status';

export default {
  mounted() {
    console.log('挂载 Donloads 页面 初始化');
    // 启动监听新建单个下载
    const $this = this;
    // 监听新建下载事件
    bus.$on('open-single-dialog', () => {
      $this.dialog.openSingle = true;
    });
    // 监听暂停事件
    bus.$on('pause-download', () => {
      $this.pauseDownload();
    });

    bus.$on('remove-download', () => {
    });

    bus.$on('start-download', () => {
    });
    // 初始化信息回调
    service.initInfoBack(this.infoBack);
    // 初始化下载回调
    service.initDownloadBack(this.downloadBack);
    // 初始化暂停下载回调
    service.initPauseBack(this.pauseBack);
  },
  data() {
    return {
      tableData: [],
      tableJson: {},
      tableSelected: [],
      form: {
        url: 'http://v.youku.com/v_show/id_XMzIwMzg4NTkzMg==.html',
        info: {},
        downloadWith: '',
      },
      info: {},
      dialog: {
        loading: false,
        openSingle: false,
        info: false,
      },
    };
  },
  methods: {
    closeDialog() {
      this.dialog.openSingle = false;
    },
    doDownload() {
      // 确认新建下载
      this.closeDialog();
      this.dialog.lodaing = false;
      this.newStart(this.form.url, this.form.downloadWith);
      this.clear();
    },
    pauseDownload() {
      const pause = [];
      this.tableSelected.forEach((item) => {
        if (item.status === status.DOING) {
          pause.push(item.uid);
        }
      });
      service.pause(pause);
    },
    newStart(url, downloadWith) {
      const uid = uuid.v1();
      const newStart = {
        uid,
        url,
        downloadWith,
      };
      service.download(this.form.url, uid, { downloadWith });
      this.tableJson[uid] = newStart;
      console.log(uid);
      console.log(this.tableJson[uid]);
    },
    pauseBack(data) {
      if (data.status && this.tableJson[data.uid]) {
        const ret = this.tableJson[data.uid];
        ret.status = data.data;
      }
    },
    downloadBack(data) {
      if (data.status) {
        const $this = this;
        const ret = this.tableJson[data.uid];
        // 只有开始下载 才有返回path
        if (data.data.name) {
          this.tableData.push(ret);
        }
        forEach(data.data, (value, key) => {
          $this.$set(ret, key, value);
        });
      }
    },
    sendInfo() {
      // 如果当前正在查询 不执行 enforce > 强制查询
      if (this.dialog.loading) return;
      if (this.form.url) {
        this.dialog.loading = true;
        service.sendInfo(this.form.url);
      } else {
        Message({ type: 'warning', message: '请设置查询地址', showClose: true });
        this.clear();
      }
    },
    infoBack(data) {
      if (data.status) {
        this.info = data.data;
        if (data.data && data.data.list) {
          // 设置默认下载
          this.form.downloadWith = data.data.list[0].downloadWith;
        }
        // console.log(`结束获取详情 ${this.dialog.loading}`);
      } else {
        Message({ type: 'error', message: data.message, showClose: true });
      }
      this.dialog.loading = false;
    },
    clear() {
      this.form.item = {};
      this.format = '';
      this.info = {};
    },
    handleSelectionChange(selection) {
      this.tableSelected = selection;
      const header = {
        start: false,
        pause: false,
        remove: false,
      };
      selection.forEach((item) => {
        // 下载中的才能暂停
        if (item.status === status.DOING) {
          header.pause = true;
        }
        // 下载完成 暂停 错误的才能删除
        if (item.status === status.DONE || item.status === status.PAUSE
          || item.status === status.ERROR) {
          header.remove = true;
        }
        // 暂停 错误的才能开始下载
        if (item.status === status.PAUSE || item.status === status.ERROR) {
          header.start = true;
        }
      });
      this.$store.dispatch('updateHeader', header);
    },
  },
  computed: {
    ...mapGetters(['getHeight']),
  },
};

</script>

<style scoped>
.download-title {
  cursor: default;
  margin-top: 5px;
}
.download-title .download-left {
  float: left;
}
</style>
