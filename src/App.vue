<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
@mixin WH($width, $height) {
  width: $width;
  height: $height;
}
body,
html {
  @include WH(100%, 100%);
  padding: 0;
  margin: 0;
  background-color: #fafafa;
}

#app {
  @include WH(100%, 100%);
}
</style>
