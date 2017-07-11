import Vue from 'vue'
import Router from 'vue-router'
import Home from '../containers/Home'
import KeMuTpl from '../containers/KeMuTpl'
import KeMuYiSequence from '../containers/KeMuYiSequence'
import KeMuYiRandom from '../containers/KeMuYiRandom'
import KeMuYiWrong from '../containers/KeMuYiWrong'
import KeMuYiMockTest from '../containers/KeMuYiMockTest'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/kemuyi',
      component: KeMuTpl,
      children: [
        {
          path: 'sequence',
          component: KeMuYiSequence
        },
        {
          path: 'random',
          component: KeMuYiRandom
        },
        {
          path: 'wrong',
          component: KeMuYiWrong
        },
        {
          path: 'mocktest',
          component: KeMuYiMockTest
        }
      ]
    }
  ]
})
