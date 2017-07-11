<template>
  <div class="container">
    <h2>科目一</h2>
    <div>
      <mt-button type="primary" 
                 class="button" 
                 v-for="(button,index) in buttons" 
                 :data="button" 
                 :key="index"
                 @click="clickhandle(index)">{{button}}</mt-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        selected : 1,
        buttons: [ '顺序练习', '随机练习', '错题本', '模拟考试' ]
      }
    },
    methods: {
      clickhandle (index) {
        let address = '',
            prefix = '/kemuyi/';
        if (typeof index !== 'number')
          index = parseInt(index);
        switch (index) {
          case 0: address = `${prefix}sequence`;break;
          case 1: address = `${prefix}random`;break;
          case 2: address = `${prefix}wrong`;break;
          case 3: address = `${prefix}mocktest`;break;
        }
        this.$router.push(address);
      }
    }
  }
</script>

<style lang="scss">
  .container {
    text-align: center;
    width: 100%;
    h2 {
      font-weight: normal;
    }
    div {
      display: flex;
      flex-direction: column;
      .button {
        margin: 20px auto;
        background-color: #00c853;
        width: 150px !important;
      }
    }
  }

</style>
