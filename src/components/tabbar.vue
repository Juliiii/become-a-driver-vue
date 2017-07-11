<template>
  <mt-tabbar class="tabber" :fixed="false">
    <mt-tab-item @click.native.stop="$emit('click', {type: 'pre'})">
      <img slot="icon" src="../icons/arrow-left.png">
      上一题
    </mt-tab-item>
    <mt-tab-item @click.native.stop="$emit('click', {type: 'next'})">
      <img slot="icon" src="../icons/arrow-right.png">
      下一题
    </mt-tab-item>
    <mt-tab-item @click.native.stop="$emit('click', {type: 'explain'})">
      <img slot="icon" src="../icons/help.png">
      本题解释
    </mt-tab-item>
  </mt-tabbar> 
</template>

<script>
export default {
}
</script>

<style>
  @import '../scss/common.scss';
</style>
