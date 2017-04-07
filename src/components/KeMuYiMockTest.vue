<template>
  <div class="parent">
    <mt-header :title="title" class="header">
      <mt-button icon="back" slot="left"></mt-button>
    </mt-header>


    <div class="content" v-if="ready">
      <div class="question">
        <span v-if="currentinfo.Type === '1'">判断</span>
        <span v-else>单选</span>
        {{currentinfo.question}}
      </div>
      <img v-if="currentinfo.sinaimg" :src="imgprefix + currentinfo.sinaimg" class="image">
      <div class="item-group">
        <div v-for="(o, index) in option" class="item" @click="selectHandle(index + 1)">
          <div v-show="!value || (value != index + 1 && currentinfo.ta != index + 1)">{{o.index}}</div>
          <img src="../icons/correct.png" alt="" v-if="value && currentinfo.ta == index + 1">
          <img src="../icons/wrong.png" alt="" v-if="value && currentinfo.ta != value && value == index + 1">
          <div>{{o.label}}</div>
        </div>
      </div>
      <div class="explain" v-if="show || show1">
        <p>最佳解释</p>
        <p>答案: {{answer}}</p>
        <p>{{currentinfo.bestanswer}}</p>
      </div>
    </div>



    <mt-tabbar class="tabber" :fixed="false" v-if="ready">
      <mt-tab-item @click.native.stop="pre">
        <img slot="icon" src="../icons/arrow-left.png">
        上一题
      </mt-tab-item>
      <mt-tab-item @click.native.stop="next">
        <img slot="icon" src="../icons/arrow-right.png">
        下一题
      </mt-tab-item>
      <mt-tab-item @click.native.stop="showexplain">
        <img slot="icon" src="../icons/help.png">
        本题解释
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        ready: false,
        current: 1,
        total: 100,
      }
    },
    computed: {
      title() {
        return `${this.current}/${this.total}`;
      }
    }
  }
</script>


<style lang="scss">
  @import "../scss/common.scss"
</style>
