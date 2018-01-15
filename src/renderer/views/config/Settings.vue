<template>
  <el-container class="settings">
    <el-aside width="200px">
      <p>设置</p>
      <ul>
        <li :class="{active : active===1}" @click="go(1)">通用</li>
        <li :class="{active : active===2}" @click="go(2)">YOU-GET</li>
        <li :class="{active : active===3}" @click="go(3)">YOUTUBE-DL</li>
        <li :class="{active : active===4}" @click="go(4)">网络</li>
        <li :class="{active : active===5}" @click="go(5)">高级</li>
      </ul>
    </el-aside>
    <el-main class="settings-main">
      <div>
        <p>通用</p>
        <el-form label-position="top" size="mini">
          <el-form-item label="下载目录">
            <el-input v-model="config.common.dir" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <p>YOU-GET</p>
      </div>
      <div>
        <p>YOUTUBE-DL</p>
      </div>
      <div>
        <p>网络</p>
      </div>
      <div>
        <p>高级</p>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      config: {
        common: {
          dir: '',
        },
      },
      active: 1,
    };
  },
  methods: {
    go(active) {
      this.active = active;
    },
  },
};
</script>

<style scoped>
.settings {
  width: 100%;
  cursor: default;
}
.settings p {
  font-size: 25px;
  padding: 10px 20px;
  margin: 0px;
}

.settings ul {
  padding: 0px;
  margin: 0px;
}
.settings .el-aside ul li {
  cursor: pointer;
  padding: 5px 0px 5px 28px;
}
.settings .active {
  border-left: 5px solid #50bfff;
  padding-left: 23px;
}
.settings .settings-main {
  position: fixed;
  margin-left: 220px;
  width: calc(100% - 200px);
  height: calc(100% - 20px);
  overflow-x: hidden;
  overflow-y: auto;
}
.settings-main div > p {
  border-bottom: 1px solid #eaeefb;
  padding: 10px 0px;
}
</style>

