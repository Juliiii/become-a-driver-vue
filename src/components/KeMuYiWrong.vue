<template>
  <div class="parent">
    <mt-header title="错题本" class="header">
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
      <mt-button slot="right">{{current}}/{{wrong.length}}</mt-button>
    </mt-header>

    <loading v-if="!loading" class="content"></loading>
    <div class="content" v-if="loading">
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
      <div class="explain" v-if="show || show">
        <p>最佳解释</p>
        <p>答案: {{answer}}</p>
        <p>{{currentinfo.bestanswer}}</p>
      </div>
    </div>



    <mt-tabbar :fixed="false" class="tabber">
      <mt-tab-item @click.native.stop="current >= 1 && current--">
        <img slot="icon" src="../icons/arrow-left.png">
        上一题
      </mt-tab-item>
      <mt-tab-item @click.native.stop="current <= wrong.length && current++">
        <img slot="icon" src="../icons/arrow-right.png">
        下一题
      </mt-tab-item>
      <mt-tab-item @click.native.stop="show = !show">
        <img slot="icon" src="../icons/help.png">
        本题解释
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script>
  import { Toast, MessageBox } from 'mint-ui';
  import {initcheckbox, update, deepclone, storage, computeAnswer} from '../utils/utils';
  import loading from './loading';
  export default {
    data() {
      return {
        imgprefix: 'http://ww3.sinaimg.cn/mw600/',
        loading: false,
        currentinfo: {},
        current: 1,
        storage: null,
        wrong: [],
        value: '',
        wrongstates: [],
        deleterecord: [],
        show: false
      }
    },
    created() {
      this.init();
    },
    computed: {
      answer() {
        return computeAnswer(this.currentinfo);
      },
      option() {
        return initcheckbox(this.currentinfo);
      }
    },
    components: {
      loading
    },
    watch: {
      async current (val, oldVal) {
        if (oldVal === 0 || oldVal === this.wrong.length + 1) return;
        if (val === 0) {
          Toast({
            message: "已经第一题了",
            position: "top"
          });
          this.current = 1;
          return;         
        }
        if (val > this.wrong.length) {
          Toast({
            message: "已经最后一题了",
            position: "top"
          });
          this.current = this.wrong.length;
          return;
        }
        this.loading = false;
        this.currentinfo = deepclone(await update(parseInt(this.wrong[val - 1])));
        this.value = this.wrongstates[val - 1];
        this.show = this.value ? (this.value !== this.currentinfo.ta) : false;
        setTimeout(() => this.loading = true, 500);       
      }
    },
    methods: {
      async init() {
        this.storage = new storage();
        let wrong = this.storage.get('wrong');
        if (wrong) {
          this.wrong = wrong.split(',');
          this.currentinfo = deepclone(await update(parseInt(this.wrong[this.current - 1])));
          this.loading = true;
          } else {
          Toast({
            message: "没有错题噢",
            position: "top"
          });
          }
        },
      selectHandle (index) {
        if (this.value) return;
        this.value = index.toString();
        this.wrongstates[this.current - 1] = this.value;
        if (this.value == this.currentinfo.ta) {
          this.deleterecord.push(this.current - 1);
          this.current <= this.wrong.length && this.current++;
        } else {
          this.show = true;
        }
      },
      showexplain () {
        this.show = !this.show;
      }
    },
    beforeDestroy() {
      const arr = this.wrong.filter((val, index) => !this.deleterecord.includes(index));
      const { length } = arr;
      this.storage.save('wrong', length === 0 ? '' : arr);
    },
  }
</script>

<style lang="scss">
  @import "../scss/common.scss"
</style>
