
'use strict'
const state = {
  apiBase: process.env.VUE_APP_API_BASE || (() => {
    const port = window.location.port;
    // 开发环境动态判断
    if (port === '8081') return '/api/node';      // Node.js 前端服务端口
    if (port === '8082') return '/api/python';    // Python 前端服务端口
    // 生产环境固定使用 Node.js
    if (port === '8089') return '/api/node';      // 生产环境 Nginx 端口
    // 默认回退（可选）
    return '/api/node';
  })()
};

const getters = {
  getApiBase: (state) => state.apiBase,
  getApiPath: (state) => (endpoint) => `${state.apiBase}${endpoint}`
};

const mutations = {
  SET_API_BASE(state, base) {
    state.apiBase = base;
  }
};


export default {
  namespaced: true,
  state,
  getters,
  mutations
};