import service from 'servicePath/index';
import global from 'commonPath/global';

const userManage = {
  namespaced: true,
  state: {
    projectid: '',
    // roleProjectid: '',
  },
  mutations: {
    setProjectid(state, payload) {
      state.projectid = payload;
    },
    // setroleProjectid(state, payload) {
    //   state.roleProjectid = payload;
    // },
  },

  getters: {},
  actions: {},
};

export default userManage;
