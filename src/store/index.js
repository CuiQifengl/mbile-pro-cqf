import Vue from 'vue'
import Vuex from 'vuex'
// 将工具模块的token引进来
import * as auth from '@/utils/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用户信息
    user: auth.getUser(),
    // 用户头像
    photo: ''
  },
  mutations: {
    // 设置用户头像
    setPhoto (state, data) {
      state.photo = data
    },
    // 修改用户信息
    setUser (state, user) {
      state.user = user
      // 修改本地的
      auth.setUser(user)
    },
    // 清除用户信息
    delUser (state) {
      state.user = {}
      auth.delUser()
    }
  },
  actions: {
  }
})
