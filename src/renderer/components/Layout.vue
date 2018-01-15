<template>
  <el-container>
    <el-header>
      <header-page></header-page>
    </el-header>
    <el-main class="main">
      <router-view :key="$router.path"></router-view>
    </el-main>
  </el-container>
</template>

<script>
import HeaderPage from './HeaderPage';

export default {
  components: { HeaderPage },
};
</script>
<style>
.el-header,
.el-main {
  padding: 0px;
}
.main {
  width: 100%;
  height: calc(100% - 80px);
  position: fixed;
  margin-top: 60px;
}
.f-left {
  float: left;
}
.f-right {
  float: right;
}
</style>

