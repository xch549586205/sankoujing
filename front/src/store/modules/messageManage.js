import service from 'servicePath/index';
import global from 'commonPath/global';

const { messageManageAsk } = service;
const messageManage = {
  namespaced: true,
  state: {
    messages: [],
  },
  mutations: {
    addMessage(state, message) {
        state.messages.push(message)
    },
    removeMessage(state, index) {
        state.messages.splice(index, 1)
    }
  },
  getters: {
    getMessges(state) {
      return state.messages
    }
  },
  actions: {
    addMessage({ commit }, params)  {
       commit('addMessage', params);
       console.log("add message")
    },
    removeMessage({ commit }, params)  {
      console.log('removeMessage', params)
       commit('removeMessage', params);
    },
  },
};

export default messageManage;