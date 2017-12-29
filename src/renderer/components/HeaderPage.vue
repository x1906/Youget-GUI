<template>
  <div class="app-header ">
    <ul class="f-left">
      <template v-if="!config.open">
        <li class="active" @click="newDownloads" title="新建下载">
          <i class="iconfont icon-jia"></i>
        </li>
        <li title="开始下载" v-bind:class="{ active: header.start }" @click="startDownload">
          <i class=" iconfont icon-kaishi"></i>
        </li>
        <li title="暂停下载" v-bind:class="{ active: header.pause }" @click="pauseDownload">
          <i class="iconfont icon-zanting"></i>
        </li>
        <li title="删除下载" v-bind:class="{ active: header.remove }" @click="removeDownload">
          <i class="iconfont icon-shanchu"></i>
        </li>
      </template>
      <template v-else>
        <li title="返回" @click="returnDownload">
          <i class="iconfont icon-fanhui"></i>
        </li>
      </template>
      <!-- <li>
        <i class="iconfont icon-yidong "></i>
      </li> -->
    </ul>
    <ul class="f-right ">
      <li>
        <el-dropdown trigger="click" style="color:#878d99; width:100%;" @command="handleCommand" :show-timeout="50" :hide-timeout="50">
          <div style="cursor: pointer; width:100%; height:100%;">
            <i class="iconfont icon-menu "></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :disabled="config.open" command="config">设置</el-dropdown-item>
            <el-dropdown-item :divided="true" command="checkupdate">检查更新</el-dropdown-item>
            <el-dropdown-item command="about">关于YougetGUI</el-dropdown-item>
            <el-dropdown-item :divided="true" command="exit">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </li>
      <!-- <li>
        <i class="iconfont icon-sousuo "></i>
      </li> -->
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import bus from './EventBus';
export default {
  data() {
    return {
      config: {
        open: false,
      },
    };
  },
  mounted() {
    this.config.open = this.$route.name !== 'Downloads';
  },
  methods: {
    returnDownload() {
      this.$router.push('Downloads');
      this.config.open = false;
    },
    handleCommand(command) {
      switch (command) {
        case 'config':
          this.$router.push('Settings');
          break;
        default:
      }
      this.config.open = true;
    },
    newDownloads() {
      // 打开单个下载窗口
      bus.$emit('open-single-dialog');
    },
    startDownload() {
      bus.$emit('start-download');
    },
    pauseDownload() {
      bus.$emit('pause-download');
    },
    removeDownload() {
      bus.$emit('remove-download');
    },
  },
  computed: {
    ...mapGetters(['header']),
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
.f-left {
  float: left;
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
