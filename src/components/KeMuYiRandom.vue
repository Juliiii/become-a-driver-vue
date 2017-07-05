<template>
  <div class="parent">
    <mt-header title="随机练习" class="header">
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
      <mt-button slot="right">{{current}}/{{total}}</mt-button>
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
          <div v-show="!select || (select != index + 1 && currentinfo.ta != index + 1)">{{o.index}}</div>
          <img src="../icons/correct.png" alt="" v-if="select && currentinfo.ta == index + 1">
          <img src="../icons/wrong.png" alt="" v-if="select && currentinfo.ta != select && select == index + 1">
          <div>{{o.label}}</div>
        </div>
      </div>
      <div class="explain" v-if="show">
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
      <mt-tab-item @click.native.stop="current <= total && current++">
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
  import {initcheckbox, update, deepclone, computeAnswer} from '../utils/utils'
  import loading from './loading';
  export default {
    data() {
      return {
        current: 1,
        total: 1330,
        currentinfo: {},
        select: '',
        loading: false,
        show: false,
        ranstates: [],
        ranRecord: []
      }
    },
    components: {
      loading
    },
    created() {
      this.init();
    },
    computed: {
      option() {
        return initcheckbox(this.currentinfo);
      },
      answer() {
        return computeAnswer(this.currentinfo);
      }
    },
    watch: {
      async current (val, oldVal) {
        if (oldVal === this.total + 1 || oldVal === 0) return;
        if (val === this.total + 1) {
          Toast({
            message: '已经最后一题了',
            position: 'top',
          });
          this.current = this.total;
          return;
        }

        if (val === 0) {
           Toast({
            message: '已经第一题了',
            position: 'top',
          });
          this.current = 1;
          return;   
        }
        let problemId;
        let storage = window.localStorage;
        storage.setItem('ran', val);
        if (val > this.ranRecord.length) {
          problemId = this.rand() + 1;
          this.ranRecord.push(problemId);
          storage.setItem('ran_record', this.ranRecord);
        } else {
          problemId = parseInt(this.ranRecord[val - 1]);
        }

        this.loading = false;
        try {
          this.currentinfo = deepclone(await update(problemId));
          this.select = this.ranstates[problemId];
          this.show = this.select ? this.select !== this.currentinfo.ta : false;
          setTimeout(() => this.loading = true, 500);
        } catch (e) {}
      }
    },
    methods: {
      async init() {
        let storage   = window.localStorage;
        let current   = storage.getItem('ran');
        let ranRecord = storage.getItem('ran_record');
        let ranstates = storage.getItem('ran_states');
        this.ranstates = ranstates ? ranstates.split(',') : [];
        this.ranRecord = ranRecord ? ranRecord.split(',') : [];

        if (current) {
          this.current = parseInt(current);
          Toast({
            message: '已经自动回到上次答题位置',
            position: 'top',
          });
        } else {
          this.current = 1;
          this.ranRecord[this.current - 1] = this.rand() + 1;
          storage.setItem('ran', this.current);
          storage.setItem('ran_record', this.ranRecord);
        }

        try {
          this.currentinfo = deepclone(await update(parseInt(this.ranRecord[this.current - 1])));
          this.select = this.ranstates[this.ranRecord[this.current - 1]];
          this.show = this.select ? this.select !== this.currentinfo.ta : false;
          setTimeout(() => this.loading = true, 500);
        } catch (e) {}
      },
      rand () {
        let num, exist;
        do {
          num = Math.floor(Math.random() * this.total);
          exist = this.ranRecord.indexOf(num + '') !== -1;
        } while (exist)
        return num;
      },
      selectHandle (index) {
        if (this.select) return;
        let storage = window.localStorage;
        this.select = index.toString();
        this.show = this.select ? this.select !== this.currentinfo.ta : false;
        this.ranstates[parseInt(this.ranRecord[this.current - 1])] = this.select;
        storage.setItem('ran_states', this.ranstates);
        if (this.select == this.currentinfo.ta) {
          this.current++;
        } else {
          let wrong = storage.getItem('wrong');
          if (wrong) {
            wrong = wrong.split(',');
            if (wrong.indexOf(this.current + '') === -1) {
              wrong.push(this.current);
              storage.setItem('wrong', wrong);
            }
          } else {
            wrong = [],
            wrong.push(this.current);
            storage.setItem('wrong', wrong);
          }
        }
      }
    },
  }
</script>

<style lang="scss">
  @import "../scss/common.scss"
</style>
