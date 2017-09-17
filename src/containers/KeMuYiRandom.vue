<template>
  <div class="parent">
    <myheader :current="current"
            :total="total"
            title="随机练习"/>

    <loading v-if="!loading" class="loading"></loading>

    <div class="body">
      <selects @onSelect="selectHandle" 
              :currentInfo="currentinfo" 
              :option="option"
              :select="select"
              v-if="loading"/>
      <explain :bestanswer="currentinfo.bestanswer"
               :answer="answer"
               v-if="loading && show"/>
    </div>

    <tabbar @click="clickHandle"/>
  </div>
</template>

<script>
  import { Toast, MessageBox } from 'mint-ui';
  import {initcheckbox, update, deepclone, computeAnswer, convert2Array, touchEnd, touchMove, touchStart} from '../utils/utils';
  import loading from '@/components/loading';
  import selects from '@/components/selects';
  import explain from '@/components/explain';
  import tabbar from '@/components/tabbar';
  import myheader from '@/components/header';
  export default {
    data() {
      return {
        current: 1,
        total: 1330,
        currentinfo: {},
        select: '',
        loading: false,
        show: false,
        ranStates: [],
        ranRecord: []
      }
    },
    components: {
      loading,
      selects,
      explain,
      tabbar,
      myheader
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
          this.select = this.ranStates[problemId];
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
        let ranStates = storage.getItem('ran_states');
        this.ranStates = convert2Array(ranStates);
        this.ranRecord = convert2Array(ranRecord);

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
          this.select = this.ranStates[this.ranRecord[this.current - 1]];
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
      selectHandle ({index}) {
        if (this.select) return;
        let storage = window.localStorage;
        this.select = index.toString();
        this.show = this.select ? this.select !== this.currentinfo.ta : false;
        this.ranStates[parseInt(this.ranRecord[this.current - 1])] = this.select;
        storage.setItem('ran_states', this.ranStates);
        if (this.select == this.currentinfo.ta) {
          this.current++;
        } else {
          let wrong = storage.getItem('wrong');
          if (wrong) {
            wrong = convert2Array(wrong);
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
      },
      clickHandle ({type}) {
        switch (type) {
          case 'pre': this.current--; break;
          case 'next': this.current++; break;
          case 'explain': this.show = !this.show; break;
        }
      }
    },
  }
</script>

<style lang="scss">
  @import "../scss/common.scss"
</style>
