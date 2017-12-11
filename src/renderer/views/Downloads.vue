<template>
  <div>
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%;" :height="getHeight">
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="name" label="名称" sortable>
      </el-table-column>
      <el-table-column prop="status" label="状态" sortable>
      </el-table-column>
      <el-table-column prop="speed" label="速度" sortable>
      </el-table-column>
      <el-table-column prop="size" label="大小" sortable>
      </el-table-column>
    </el-table>

    <!-- 新建下载弹出层 -->
    <el-dialog title="新建下载" class="app-dialog" :visible.sync="downloadDialog" :close-on-click-modal="dialog.modelClode" width="65%" :before-close="closeDialog">
      <el-form>
        <el-form-item>
          <div v-if="info.title" class="download-title">
            <div class="download-left">来源: {{info.site}} &emsp;文件名称:&nbsp;</div>
            <div style="width:60%; overflow: hidden; text-overflow:ellipsis; white-space: nowrap;" v-bind:title="info.title">{{ info.title }}
            </div>
          </div>
          <el-input v-model="form.url" @blur="sendInfo" placeholder="请输入下载视频网址">
            <template slot="append">
              <el-button :loading="dialog.loading" title="显示详情" @click="sendInfo(true)">
                <i v-if="!dialog.loading" class="iconfont icon-xiangqing"></i>
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select :v-if="info.list" v-model="form.format" placeholder="请选择" style="width:100%;" @change="selectChange(item)">
            <el-option v-for="item in info.list" :key="item.format" :label="(item.videoProfile || '') +' '+ item.format" :value="item.format">
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
import { Message } from 'element-ui';
import each from 'foreach';
import { sendInfo, initInfoBack, download, initDownloadBack } from '../ipc/ipcRenderer';
export default {
  mounted() {
    console.log('挂载 initInfo');
    // 初始化信息回调
    initInfoBack(this.infoBack);
    // 初始化下载回调
    initDownloadBack(this.downloadBack);
  },
  data() {
    return {
      tableData: [],
      tableJson: {},
      form: {
        url: 'http://v.youku.com/v_show/id_XMzIwMzg4NTkyOA==.html',
        info: {},
        format: '',
        item: {},
      },
      load: '',
      info: {},
      dialog: {
        loading: false,
        modelClode: false,
      },
    };
  },
  methods: {
    closeDialog() { // 关闭新建下载窗口
      this.$store.dispatch('toggleDownload', false);
      // const url = 'http://v.youku.com/v_show/id_XMzIwMzg4NTkyOA==.html';
      // const index = this.tableJson[url];
      // const ret = this.tableData[index];
      // console.log(ret);
    },
    doDownload() {
      // 确认新建下载
      this.closeDialog();
      this.dialog.lodaing = false;
      const options = {};
      if (this.form.item.downloadWith) {
        options.downloadWith = this.form.item.downloadWith;
      }
      this.tableData.push({
        url: this.form.url,
        downloadWith: options.downloadWith,
      });
      this.tableJson[this.form.url] = this.tableData.length - 1;
      download(this.form.url, options);
      this.clear();
    },
    downloadBack(data) {
      if (data.status) {
        const index = this.tableJson[data.url];
        const ret = this.tableData[index];
        each(data.data, (value, key) => {
          console.log(`key ${key} \t value ${value}`);
          ret[key] = value;
        });
        // download();
      }
    },
    sendInfo(enforce) {
      // 如果当前正在查询 不执行 enforce > 强制查询
      if (this.dialog.loading || (this.load === this.form.url && !enforce)) return;
      if (this.form.url) {
        if (this.load !== this.form.url) this.clear();
        this.dialog.loading = true;
        sendInfo(this.form.url);
      } else {
        Message({ type: 'warning', message: '请设置查询地址', showClose: true });
      }
    },
    infoBack(data) {
      if (data.status) {
        this.info = data.data;
        this.load = this.form.url;
        if (data.data) {
          this.form.item = data.data.list[0];
          this.form.format = this.form.item.format;
        }
        // console.log(`结束获取详情 ${this.dialog.loading}`);
      } else {
        Message({ type: 'error', message: data.message, showClose: true });
      }
      this.dialog.loading = false;
    },
    selectChange(item) {
      this.form.item = item;
    },
    clear() {
      this.form.item = {};
      this.format = '';
      this.info = {};
    },
  },
  computed: {
    ...mapGetters(['getHeight', 'downloadDialog']),
  },
};

</script>

<style scoped>
.download-title {
  cursor: default;
}
.download-title .download-left {
  float: left;
}
</style>
