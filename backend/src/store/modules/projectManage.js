import service from 'servicePath/index';
import global from 'commonPath/global';

const { projectManageAsk } = service;
const projectManage = {
  namespaced: true,
  state: {
    projectList: [],
    platformMap: [
      {
        "key": "alibaba",
        "value": "阿里巴巴"
      },
      {
        "key": "jingdong",
        "value": "京东"
      },
      {
        "key": "broadlink",
        "value": "博联"
      },
      {
        "key": "tencent",
        "value": "腾讯"
      },
      {
        "key": "yuntongxun",
        "value": "云通讯"
      },
      {
        "key": "yingshi",
        "value": "萤石"
      },
    ],
    blackListStatus: [
      {
        text: '黑名单',
        value: 1,
      },
      {
        text: '白名单',
        value: 2,
      },
    ],
    blackIptype: 0,
    currentProjectid: undefined
  },

  mutations: {
    setProjectList(state, payload) {
      state.projectList = payload;
    },
    setBlackStauts(state, payload) {
      state.blackIptype = payload;
    },

    setCurrentProjectid(state, payload) {
      state.currentProjectid = payload;
    },
  },

  getters: {},
  actions: {
    // 查询项目列表
    async setProjectList(
      { commit },
      args = {
        limit: global.MAX_LEN,
        offset: 1,
      }
    ) {
      const { errcode, data = {} } = await projectManageAsk.getProject(args);
      if (errcode === 200) {
        const { projects = [] } = data;
        commit('setProjectList', projects);
      }
    },
    
  },
};

export default projectManage;
