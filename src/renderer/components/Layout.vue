<template>
  <el-container>
    <el-header>
      <header-page></header-page>
    </el-header>
    <el-main>
      <main-page></main-page>
    </el-main>
  </el-container>
</template>

<script>
import HeaderPage from './HeaderPage';
import MainPage from './MainPage';

export default {
  components: { HeaderPage, MainPage },
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

