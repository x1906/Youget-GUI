<template>
  <el-container>
    <el-header>
      <header-page></header-page>
    </el-header>
    <el-main style="height:calc(100% - 60px);">
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
.f-left {
  float: left;
}
.f-right {
  float: right;
}
</style>

