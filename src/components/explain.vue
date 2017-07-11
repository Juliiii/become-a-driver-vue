<template>
<div class="explain">
  <p>最佳解释</p>
  <p>答案: {{answer}}</p>
  <p>{{bestanswer}}</p>
</div> 
</template>

<script>
export default {
  props: {
    answer: {
      type: String,
      required: true
    },
    bestanswer: {
      type: String,
      required: true
    }
  }
}
</script>

<style>
  @import '../scss/common.scss';
</style>
