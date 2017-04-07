<template>
  <div class="parent">
    <mt-header title="顺序练习" class="header">
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
      <mt-button slot="right" v-if="ready">{{current}}/{{total}}</mt-button>
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
  import { Toast, MessageBox } from 'mint-ui';
  import { update, initcheckbox, computeAnswer, deepclone, storage } from '../utils/utils'
  export default {
    data() {
      return {
        imgprefix: 'http://ww3.sinaimg.cn/mw600/',
        current: 1,
        total: 1330,
        currentinfo: {},
        value: '',
        ready: false,
        sqpstates: [],
        sinaimg: '',
        storage: null,
        show1: false
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
      },
      show() {
        if (this.value && this.value != this.currentinfo.ta) {
          return true;
        } else {
          return false;
        }
      }
    },
    methods: {
      async init() {
        this.storage = new storage();
        let current   = this.storage.get('sqp'),
            sqpstates = this.storage.get('sqpstates');
        if (sqpstates) {
          this.sqpstates = sqpstates.split(',');
        }
        let flag = false;
        if (current) {
          this.current = parseInt(current);
          flag = true;
        } else {
          this.current = 1;
          this.storage.save('sqp', this.current);
        }

        try {
          let data = await update(this.current);
          this.currentinfo = deepclone(data);
          this.value = this.sqpstates[this.current - 1];
          this.ready = true;
        } catch (e) {

        }
        if (flag) {
          Toast({
            message: '已经自动回到上次答题位置',
            position: 'top',
          })
        }
      },
      showexplain() {
        this.show1 = !this.show1;
      },
      async next() {
        this.value = ''
        this.ready = this.show1 =false;
        if (this.current === this.total) {
          let action = '';
          try {
            action = await MessageBox.confirm(`已经做完了,重来么?`);
          } catch (e) {}
          if (action === 'confirm') {
            this.storage.remove('sqp');
            this.storage.remove('sqpstates');
            this.sqpstates = [];
            this.init();
          }
        } else {
          this.current++;
          this.storage.save('sqp', this.current);
        }
        try {
          this.currentinfo = deepclone(await update(this.current));
          this.value = this.sqpstates[this.current - 1];
          this.ready = true;
        } catch (e) {}
      },
      async pre() {
        this.value = '';
        this.ready = this.show1 = false;
        if (this.current === 1) {
          Toast({
            message: '已经是第一题了',
            position: 'top',
            });
        } else {
          this.current--;
          this.storage.save('sqp', this.current);
        }
        try {
          this.currentinfo = deepclone(await update(this.current));
          this.value = this.sqpstates[this.current - 1];
          this.ready = true;
        } catch (e) {}
      },
      selectHandle(index) {
        if (this.value) return;
        this.value = index.toString();
        this.sqpstates[this.current - 1] = this.value;
        this.storage.save('sqpstates', this.sqpstates);
        if (this.value === this.currentinfo.ta) {
          this.next();
        } else {
          let wrong = this.storage.get('wrong');
          if (wrong) {
            wrong = wrong.split(',');
            if (wrong.indexOf(this.current + '') === -1) {
              wrong.push(this.current);
              this.storage.save('wrong', wrong);
            }
          } else {
            wrong = [];
            wrong.push(this.current);
            this.storage.save('wrong', wrong);
          }
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "../scss/common.scss"
</style>
