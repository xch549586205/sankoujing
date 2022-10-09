import service from 'servicePath/index';
import global from 'commonPath/global';

const { userManageAsk } = service;
const userManage = {
  namespaced: true,
  state: {
    roleID: '-',
    displayName: '',
  },
  mutations: {
    setRoleid(state, payload) {
      state.roleID = payload;
    },
    searchDisplayname(state, payload) {
      state.displayName = payload;
    },
  },

  getters: {},
  actions: {

  },
};

export default userManage;
