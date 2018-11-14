<!-- 这是模板的HTMLDom结构 -->
<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
  </div>
</template>

<!-- 你可以在这里写一些页面的js的逻辑代码 -->
<script>
export default {
  name: 'App'
}
</script>

<!-- 页面需要的CSS样式 -->
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
