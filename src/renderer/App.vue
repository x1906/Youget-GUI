<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'youget-gui',
  mounted() {
    const $this = this;
    window.onresize = () => {
      $this.$store.dispatch('resizeWindow', window.innerHeight);
    };
  },
};
</script>

<style>
body {
  margin: 0px;
}
</style>
