<template>
  <div class="parent">
    <mt-header title="错题本" class="header">
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
      <mt-button slot="right" v-if="ready">{{current}}/{{wrong.length}}</mt-button>
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



    <mt-tabbar :fixed="false" class="tabber" v-if="ready">
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
  export default {
    data() {
      return {
        imgprefix: 'http://ww3.sinaimg.cn/mw600/',
        ready: false,
        currentinfo: {},
        current: 1,
        storage: null,
        wrong: [],
        value: '',
        wrongstates: [],
        deleterecord: [],
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
        if (!this.value) return false;
        return this.value !== this.currentinfo.ta;
      }
    },
    methods: {
      async init() {
        this.storage = new storage();
        let wrong   = this.storage.get('wrong');
        if (wrong) {
          this.wrong = wrong.split(',');
          this.currentinfo = deepclone(await update(parseInt(this.wrong[this.current - 1])));
          this.ready = true;
          }
        },
      selectHandle(index) {
        if (this.value) return;
        this.value = index.toString();
        this.wrongstates[this.current - 1] = this.value;
        if (this.value == this.currentinfo.ta) {
          this.deleterecord.push(this.current - 1);
          this.next();
        }
      },
      showexplain() {
        this.show1 = !this.show1;
      },
      async next() {
        if (this.current === this.wrong.length) {
          Toast({
            message: "已经最后一题了",
            position: "top"
          });
        } else {
          this.current++;
          this.currentinfo = deepclone(await update(parseInt(this.wrong[this.current - 1])));
          this.value = this.wrongstates[this.current - 1];
          this.ready = true;
        }
      },
      async pre() {
        if (this.current === 1) {
          Toast({
            message: "已经第一题了",
            position: "top"
          });
        } else {
          this.current--;
          this.currentinfo = deepclone(await update(parseInt(this.wrong[this.current - 1])));
          this.value = this.wrongstates[this.current - 1];
          this.ready = true;
        }
      }
    },
    beforeDestroy() {
      let arr = [];
      console.log(this.deleterecord)
      for (let start = 0, end = this.wrong.length; start < end; start++) {
        if (this.deleterecord.indexOf(start) === -1) {
          arr.push(this.wrong[start]);
        }
      }
      this.storage.save('wrong', arr);
    },
  }
</script>

<style lang="scss">
  @import "../scss/common.scss"
</style>
