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
}
</style>
