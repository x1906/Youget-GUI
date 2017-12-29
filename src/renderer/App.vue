<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'YougetGUI',
  mounted() {
    const $this = this;
    this.$store.dispatch('resizeWindow', window.innerHeight);
    window.onresize = () => {
      $this.$store.dispatch('resizeWindow', window.innerHeight);
    };
  },
};
</script>

<style>
body {
  margin: 0px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
ul li {
  list-style: none;
}
</style>
