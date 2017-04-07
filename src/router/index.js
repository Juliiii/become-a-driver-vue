import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home'
import KeMuTpl from '../components/KeMuTpl'
import KeMuYiSequence from '../components/KeMuYiSequence'
import KeMuYiRandom from '../components/KeMuYiRandom'
import KeMuYiWrong from '../components/KeMuYiWrong'
import KeMuYiMockTest from '../components/KeMuYiMockTest'
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
