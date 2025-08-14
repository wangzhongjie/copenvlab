'use strict'
import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import { createRouter, createWebHistory } from 'vue-router'

import deal from './components/deal.vue'


const routes = [
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('./components/NotFound.vue'),
      meta: { headShow: true }
    },
    { path: '/', redirect: '/deal'  },
    { path: '/deal', component: deal, name: 'deal', meta: { title: 'deal', headShow: true, } },
];
// 创建路由实例（Vue Router 4+ 语法）
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 初始化 Vue 3 应用
const app = createApp(App)

// 安装路由
app.use(router)
app.use(store)
// 挂载应用
app.mount('#app')