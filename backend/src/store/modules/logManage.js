import service from 'servicePath/index';
import global from 'commonPath/global';

const logManage = {
  namespaced: true,
  state: {
    projectid: '',
    rangeTime: [],
  },
  mutations: {
    setProjectid(state, payload) {
      state.projectid = payload;
    },
    setRangeTime(state, payload) {
      state.rangeTime = payload;
    }
  },

  getters: {},
  actions: {},
};

export default logManage;
