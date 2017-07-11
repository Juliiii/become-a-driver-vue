<template>
<mt-header :title="title" class="header">
  <router-link to="/" slot="left">
    <mt-button icon="back"></mt-button>
  </router-link>
  <mt-button slot="right">{{current}}/{{total}}</mt-button>
</mt-header>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    current: {
      type: Number,
      required: true
    },
    total: {
      type:Number,
      required: true
    }
  }
}
</script>

<style>
  @import '../scss/common.scss';
</style>
