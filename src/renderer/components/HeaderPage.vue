<template>
  <div class="app-header ">
    <ul class="f-left">
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
      <!-- <li>
        <i class="iconfont icon-yidong "></i>
      </li> -->
    </ul>
    <ul class="f-right ">
      <li>
        <i class="iconfont icon-menu "></i>
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
  methods: {
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
