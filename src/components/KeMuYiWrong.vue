<template>
  <div class="parent">
    <mt-header title="错题本" class="header">
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
      <mt-button slot="right" v-if="wrong.length">{{current}}/{{wrong.length}}</mt-button>
    </mt-header>

    <loading v-if="!loading" class="content"></loading>
    <div class="content" v-if="loading">
      <div class="question">
        <span v-if="problem.Type === '1'">判断</span>
        <span v-else>单选</span>
        {{problem.question}}
      </div>
      <img v-if="problem.sinaimg" :src="$imgPrefix + problem.sinaimg" class="image">
      <div class="item-group">
        <div v-for="(o, index) in option" class="item" @click="selectHandle(index + 1)" :key="index">
          <div v-show="!select || (select != index + 1 && problem.ta != index + 1)">{{o.index}}</div>
          <img src="../icons/correct.png" alt="" v-if="select && problem.ta == index + 1">
          <img src="../icons/wrong.png" alt="" v-if="select && problem.ta != select && select == index + 1">
          <div>{{o.label}}</div>
        </div>
      </div>
      <div class="explain" v-if="show || show">
        <p>最佳解释</p>
        <p>答案: {{answer}}</p>
        <p>{{problem.bestanswer}}</p>
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
  import {initcheckbox, update, deepclone, computeAnswer, convert2Array, touchEnd, touchMove, touchStart} from '../utils/utils';
  import loading from './loading';
  export default {
    data() {
      return {
        loading: false,
        show: false,
        problem: {},
        current: 1,
        wrong: [],
        select: '',
        states: []
      }
    },
    created () {
      window.addEventListener('touchstart', touchStart.bind(this));
      window.addEventListener('touchmove', touchMove.bind(this));
      window.addEventListener('touchend', touchEnd.bind(this));
      this.init();
    },
    destroyed() {
      window.removeEventListener('touchstart', touchStart.bind(this));
      window.removeEventListener('touchmove', touchMove.bind(this));
      window.removeEventListener('touchend', touchEnd.bind(this));
    },
    computed: {
      answer() {
        return computeAnswer(this.problem);
      },
      option() {
        return initcheckbox(this.problem);
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
        this.problem = deepclone(await update(parseInt(this.wrong[val - 1])));
        this.select = this.states[val - 1];
        this.show = this.select ? (this.select !== this.problem.ta) : false;
        setTimeout(() => this.loading = true, 500);       
      }
    },
    methods: {
      async init() {
        let wrong = localStorage.getItem('wrong');
        if (wrong) {
          this.wrong = convert2Array(wrong);
          this.problem = deepclone(await update(parseInt(this.wrong[this.current - 1])));
          this.loading = true;
        } else {
          Toast({
            message: "没有错题噢",
            position: "top"
          });
          }
      },
      selectHandle (index) {
        if (this.select) return;
        this.select = index.toString();
        this.states[this.current - 1] = this.select;
        if (this.select == this.problem.ta) {
          // this.remove.push(this.current - 1);
          this.removeTrueItem(this.current - 1);
          this.current <= this.wrong.length && this.current++;
        } else {
          this.show = true;
        }
      },
      removeTrueItem (targetIndex) {
        let storage = window.localStorage;
        let ranStates = storage.getItem('ran_states');
        let ranRecord = storage.getItem('ran_record');
        let seqStates = storage.getItem('sqp_states');
        let wrong = storage.getItem('wrong');

        const target = this.wrong[targetIndex];

        ranStates = convert2Array(ranStates);
        ranRecord = convert2Array(ranRecord);
        seqStates = convert2Array(seqStates);
        wrong = convert2Array(wrong);

        seqStates = seqStates.map((val, index) => index != target ? val : null);
        ranStates[parseInt(target)] = null;
        ranRecord = ranRecord.filter(val => target != val);
        let arr = wrong.filter((val, index) => val !== target);

        storage.setItem('wrong', arr.length === 0 ? '' : arr);
        storage.setItem('ran_states', ranStates.length ? ranStates : '');
        storage.setItem('ran_record', ranRecord.length ? ranRecord : '');
        storage.setItem('sqp_states', seqStates.length ? seqStates : '');        
      }
    }
  }
</script>

<style lang="scss">
  @import "../scss/common.scss"
</style>
