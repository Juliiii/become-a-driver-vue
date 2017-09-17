<template>
  <div class="parent">
    <myheader :current="current"
            :total="total"
            title="顺序练习"/>

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
  import { update, initcheckbox, computeAnswer, deepclone, convert2Array, touchEnd, touchMove, touchStart } from '../utils/utils';
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
        sqpstates: [],
        show: false
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
    components: {
      loading,
      selects,
      explain,
      tabbar,
      myheader
    },
    computed: {
      answer () {
        return computeAnswer(this.currentinfo);
      },
      option () {
        return initcheckbox(this.currentinfo);
      }
    },
    watch: {
      async current (val, oldVal) {
        if (oldVal === this.total + 1 || oldVal === 0) return;
        if (val === this.total + 1) {
          let action = '';
          try {
            action = await MessageBox.confirm(`已经做完了,重来么?`);
          } catch (e) {}
          if (action === 'confirm') {
            localStorage.removeItem('sqp_current');
            localStorage.removeItem('sqp_states');
            this.sqpstates = [];
            this.init();
          }
          this.current = this.total;
          return;    
        }
        if (val === 0) {
           Toast({
            message: '已经是第一题了',
            position: 'top',
          });
          this.current = 1;
          return;  
        }
        this.loading = false;
        this.select = null;
        try {
          this.currentinfo = deepclone(await update(val));
          this.select = this.sqpstates[val - 1];
          this.show = this.select ? this.select !== this.currentinfo.ta : false;
          localStorage.setItem('sqp_current', val);
          setTimeout(() => this.loading = true, 500);
        } catch (e) {}

      }
    },
    methods: {
      async init() {
        let current   = localStorage.getItem('sqp_current'),
            sqpstates = localStorage.getItem('sqp_states');
        if (sqpstates) {
          this.sqpstates = convert2Array(sqpstates);
        }
        if (current) {
          this.current = parseInt(current);
          Toast({
            message: '已经自动回到上次答题位置',
            position: 'top',
          })
        } else {
          this.current = 1;
          localStorage.setItem('sqp_current', this.current);
        }

        try {
          let data = await update(this.current);
          this.currentinfo = deepclone(data);
          this.select = this.sqpstates[this.current - 1];
          console.log(this.select);
          this.show = this.select ? this.select !== this.currentinfo.ta : false;
          this.loading = true;
        } catch (e) {}
      },
      selectHandle({index}) {
        if (this.select) return;
        this.select = index.toString();
        this.show = this.select ? this.select !== this.currentinfo.ta : false;
        this.sqpstates[this.current - 1] = this.select;
        localStorage.setItem('sqp_states', this.sqpstates);
        if (this.select === this.currentinfo.ta) {
          this.current++;
        } else {
          let wrong = localStorage.getItem('wrong');
          if (wrong) {
            wrong = convert2Array(wrong);
            if (wrong.indexOf(this.current + '') === -1) {
              wrong.push(this.current);
              localStorage.setItem('wrong', wrong);
            }
          } else {
            wrong = [];
            wrong.push(this.current);
            localStorage.setItem('wrong', wrong);
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
    }
  }
</script>

<style lang="scss">
  @import "../scss/common.scss";
</style>
