<template>
  <div class="parent">
    <mt-header title="随机练习" class="header">
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
      <mt-button slot="right" v-if="ready">{{current}}/{{total}}</mt-button>
    </mt-header>

    <loading v-if="!ready" class="content"></loading>
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


    <mt-tabbar :fixed="false" class="tabber">
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
  import {initcheckbox, update, deepclone, storage, computeAnswer} from '../utils/utils'
  import loading from './loading';
  export default {
    data() {
      return {
        imgprefix: 'http://ww3.sinaimg.cn/mw600/',
        current: 1,
        total: 1330,
        currentinfo: {},
        value: '',
        ready: false,
        ranstates: [],
        ranrecord: [],
        sinaimg: '',
        storage: null,
        show1: false,
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
      },
      show() {
        if (!this.value) return false
        return !(this.value == this.currentinfo.ta)
      }
    },
    methods: {
      async init() {
        this.storage = new storage();
        let current   = this.storage.get('ran'),
            ranrecord = this.storage.get('ranrecord'),
            ranstates = this.storage.get('ranstates'),
            flag      = false;
        if (ranstates) {
          this.ranstates = ranstates.split(',');
        }
        if (ranrecord) {
          this.ranrecord = ranrecord.split(',');
        }
        if (current) {
          this.current = parseInt(current);
          flag = !flag;
        } else {
          this.current = 1;
          this.ranrecord[this.current - 1] = this.rand() + 1;
          this.storage.save('ran', this.current);
          this.storage.save('ranrecord', this.ranrecord);
        }

        try {
          console.log(this.ranrecord[this.current - 1]);
          this.currentinfo = deepclone(await update(parseInt(this.ranrecord[this.current-1])));
          this.value = this.ranstates[this.ranrecord[this.current-1]];
          this.ready = true;
        } catch (e) {
          console.log(e);
        }

        if (flag) {
          Toast({
            message: '已经自动回到上次答题位置',
            position: 'top',
          })
        }
      },
      rand() {
        let num, exist;
        do {
          num = Math.floor(Math.random() * this.total);
          exist = this.ranrecord.indexOf(num + '') !== -1 ? false : true;
        } while (!exist)
        return num;
      },
      async next() {
        this.value = '';
        this.ready = this.show1 = false;
        if (this.current === this.total - 1) {
          alert('最后一题了，逗逼')
        } else {
          this.current++;
          this.storage.save('ran', this.current);
          let temp;
          if (this.current > this.ranrecord.length) {
            temp = this.rand() + 1;
            this.ranrecord.push(temp);
            this.storage.save('ranrecord', this.ranrecord);
          } else {
            temp = parseInt(this.ranrecord[this.current - 1]);
          }

          try {
            this.currentinfo = deepclone(await update(temp));
            this.value = this.ranstates[temp];
            let that = this;
            setTimeout(function() {
              that.ready = true;
            }, 2000);
            // this.ready = true;
          } catch (e) {}
        }
      },
      async pre() {
        this.value = '';
        this.ready = this.show1 = false;
        if (this.current === 1) {
          Toast({
            message: '已经第一题了',
            position: 'top'
          })
        } else {
          this.current--;
          this.storage.save('ran', this.current);

          try {
            this.currentinfo = deepclone(await update(parseInt(this.ranrecord[this.current - 1])));
            this.value = this.ranstates[this.ranrecord[this.current - 1]];
            this.ready = true;
          } catch (e) {}
        }
      },
      selectHandle(index) {
        if (this.value)
          return;
        this.value = index.toString();
        this.ranstates[parseInt(this.ranrecord[this.current - 1])] = this.value;
        this.storage.save('ranstates', this.ranstates);
        if (this.value == this.currentinfo.ta) {
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
            wrong = [],
            wrong.push(this.current);
            this.storage.save('wrong', wrong);
          }
        }
      },
      showexplain() {
        this.show1 = !this.show1;
      }
    },
  }
</script>

<style lang="scss">
  @import "../scss/common.scss"
</style>
