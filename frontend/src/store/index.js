'use strict'
import { createStore } from 'vuex'
import apiConfig from './modules/apiConfig'

export default createStore({
  modules: {
    apiConfig // 确保模块名称与命名空间一致
  }
})