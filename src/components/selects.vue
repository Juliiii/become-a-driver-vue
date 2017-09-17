<template>
<div class="content">
  <div class="question">
    <span v-if="currentInfo.Type === '1'">判断</span>
    <span v-else>单选</span>
    {{currentInfo.question}}
  </div>
  <img v-if="currentInfo.sinaimg" :src="$imgPrefix + currentInfo.sinaimg" class="image">
  <div class="item-group">
    <div v-for="(o, index) in option" class="item" @click="onSelect(index + 1)" :key="index">
      <div v-show="!select || (select != index + 1 && currentInfo.ta != index + 1)">{{o.index}}</div>
      <img src="../icons/correct.png" alt="" v-if="select && currentInfo.ta == index + 1">
      <img src="../icons/wrong.png" alt="" v-if="select && currentInfo.ta != select && select == index + 1">
      <div>{{o.label}}</div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    currentInfo: {
      type: Object,
      required: true
    },
    option: {
      type: Array,
      required: true
    },
    select: {
      type: String
    }
  },
  methods: {
    onSelect (index) {
      // this.select = index;
      this.$emit('onSelect', {index});
    }
  }
}
</script>


<style lang="scss">
  @import "../scss/common.scss";
</style>
