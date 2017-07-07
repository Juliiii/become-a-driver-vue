<template>
  <div class="parent">
    <mt-header :title="title" class="header">
      <mt-button icon="back" slot="left"></mt-button>
      <span slot="right" class="cell">{{time}}</span>
    </mt-header>

    <loading v-if="!loading" class="content"></loading>
    <div class="content" v-if="loading">
      <div class="question">
        <span v-if="currentInfo.Type === '1'">判断</span>
        <span v-else>单选</span>
        {{currentInfo.question}}
      </div>
      <img v-if="currentInfo.sinaimg" :src="$imgPrefix + currentInfo.sinaimg" class="image">
      <div class="item-group">
        <div v-for="(o, index) in option" class="item" @click="selectHandle(index + 1)" :key="index">
          <div v-show="!select || (select != index + 1 && currentInfo.ta != index + 1)">{{o.index}}</div>
          <img src="../icons/correct.png" alt="" v-if="select && currentInfo.ta == index + 1">
          <img src="../icons/wrong.png" alt="" v-if="select && currentInfo.ta != select && select == index + 1">
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
  import {initcheckbox, update, deepclone, convert2Array} from '@/utils/utils';
  import { MessageBox } from 'mint-ui';
  export default {
    data() {
      return {
        loading: false,
        select: null,
        current: 1,
        currentInfo: {},
        total: 100,
        minutes: 45,
        seconds: 0,
        record: [],
        states: [],
        timeId: null,
        storage: null
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
      },
      option () {
        return initcheckbox(this.currentInfo);
      }
    },
    created () {
      this.storage = window.localStorage;
      this.minutes = parseInt(this.storage.getItem('minutes'));
      this.seconds = parseInt(this.storage.getItem('seconds'));
      this.timeId = setInterval(() => {
        this.seconds--;
        if (this.seconds === 0 && this.minutes === 0) {
          clearInterval(this.timeId);
          return;
          // TODO
        }
        if (this.seconds < 0) {
          this.minutes--;
          this.seconds = 59;
        }
        this.storage.setItem('minutes', this.minutes);
        this.storage.setItem('seconds', this.seconds);
      }, 1000);

      this.init();
    },
    watch: {
      async current (val, oldVal) {
        if (oldVal === this.total + 1 || oldVal === 0) return;
        if (val === this.total + 1) {
          //TODO 是否交卷
          await this.handIn();
          this.current = this.total;
          return;
        }

        if (val === 0) {
          this.current = 1;
          return;
        }
        this.loading = false;
        this.storage.setItem('mock', val);
        try {
          this.currentInfo = (await update(parseInt(this.record[this.current - 1]))).data;
          this.select = this.states[this.current - 1];
          setTimeout(() => this.loading = true, 300);
        } catch (ex) {}
      }
    },
    methods: {
      async init () {
        const arr = this.storage.getItem('mock_record');
        const states = this.storage.getItem('mock_states');
        this.states = convert2Array(states);
        if (!arr) {
          for (let i = 0; i < 100; i++) {
            this.record.push(this.rand() + 1);
          }

          this.storage.setItem('mock_record', this.record);
        } else {
          this.record = convert2Array(arr);
          this.current = parseInt(this.storage.getItem('mock'));
        }
        try {
          this.currentInfo = (await update(this.current)).data;
          this.select = this.states[this.current - 1];
          setTimeout(() => this.loading = true, 300);
        } catch (ex) {}

      },
      rand () {
        let exist, num;
        let {random, floor} = Math;
        do {
          num = floor(random() * 1330);
          exist = this.record.includes(num);
        } while (exist);

        return num;
      },
      selectHandle (index) {
        if (this.select) return;
        index = index.toString();
        this.select = index + 1;
        this.states[this.current - 1] = this.select;
        if (index !== this.currentInfo.ta) {
          let wrong = this.storage.getItem('wrong');
          const problemId = this.record[this.current - 1].toString();
          wrong = convert2Array(wrong);
          if (wrong.length) {
            if (!wrong.includes(problemId)) {
              wrong.push(problemId);
              this.storage.setItem('wrong', wrong);
            }
          } else {
            wrong = [];
            wrong.push(problemId);
            this.storage.setItem('wrong', wrong);
          }
        }
        setTimeout(() => this.current++, 300);
      },
      async handIn () {
        let action = '';
        try {
          action = await MessageBox.confirm(`交卷?`);
        } catch (e) {}
        if (action === 'confirm') {
        }
      }
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
