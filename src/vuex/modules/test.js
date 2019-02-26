import api from '../../assets/js/api'
import {TEST} from '../../assets/js/urlConfig'
/* 初始化数据 */
const state = {
  testObj: {}
}

// 异步获取数据，commit给mutations，mutations改变state
const actions = {
  // 获取测试信息
  getTestObj ({commit}, params) {
    api.get({url: TEST, params: params}).then(
      res => {
        commit('setTestObj', res)
      },
      (e, res) => {
      })
  }
}

const getters = {
  testObj: state => state.testObj
}

// 同步获取
const mutations = {
  setTestObj (state, res) {
    state.testObj = res
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
