<template>
  <div class="parent">
    <mt-header :title="title" class="header">
      <mt-button icon="back" slot="left"></mt-button>
      <span slot="right" class="cell">{{time}}</span>
    </mt-header>

    <loading v-if="!loading" class="content"></loading>
    <div class="content" v-if="loading">
      <div class="question">
        <span v-if="currentinfo.Type === '1'">判断</span>
        <span v-else>单选</span>
        {{currentinfo.question}}
      </div>
      <img v-if="currentinfo.sinaimg" :src="$imgPrefix + currentinfo.sinaimg" class="image">
      <div class="item-group">
        <div v-for="(o, index) in option" class="item" @click="selectHandle(index + 1)" :key="index">
          <div v-show="!value || (value != index + 1 && currentinfo.ta != index + 1)">{{o.index}}</div>
          <img src="../icons/correct.png" alt="" v-if="value && currentinfo.ta == index + 1">
          <img src="../icons/wrong.png" alt="" v-if="value && currentinfo.ta != value && value == index + 1">
          <div>{{o.label}}</div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <mt-button type="primary" class="submit" size="large">交卷</mt-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        loading: false,
        current: 1,
        total: 100,
        minutes: 45,
        seconds: 0,
        timeId: null
      }
    },
    computed: {
      title () {
        return `${this.current}/${this.total}`;
      },
      time () {
        let minutes = this.minutes >= 10 ? this.minutes : '0' + this.minutes;
        let seconds = this.seconds >= 10 ? this.seconds : '0' + this.seconds;
        return `${minutes}:${seconds}`;
      }
    },
    created () {
      this.timeId = setInterval(() => {
        this.seconds--;
        if (this.seconds === 0 && this.minutes === 0) {
          clearInterval(this.timeId);
          return;
        }
        if (this.seconds < 0) {
          this.minutes--;
          this.seconds = 59;
        }
      }, 1000);
    },
    methods: {
    }
  }
</script>


<style lang="scss">
  @import "../scss/common.scss";

  .bottom {
    display: flex;
    justify-content: center;
    align-items: center;
    background: white;
    .submit {
      background: #00c853;
    }
  }
</style>
