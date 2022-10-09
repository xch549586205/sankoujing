import service from 'servicePath/index';
import global from 'commonPath/global';

const { productManageAsk, platformManageAsk } = service;
const app = {
  namespaced: true,
  state: {
    categoryList: [],
    devicetypeList: [
      {
        key: 'gateway',
        name: '网关',
      },
      {
        key: 'device',
        name: '设备',
      },
      {
        key: 'subdevice',
        name: '子设备',
      },
      {
        key: 'note',
        name: '短信服务',
      },
      {
        key: 'email',
        name: '邮件服务',
      },
      {
        key: 'official',
        name: '公众号',
      },
    ],
    platformList: [
      {
        key: 'broadlink',
        name: '博联',
      },
      {
        key: 'alibaba',
        name: '阿里',
      },
      {
        key: 'jingdong',
        name: '京东',
      },
      {
        key: 'wxgzh',
        name: '微信',
      },
      {
        key: 'yuntongxun',
        name: '云通讯',
      },
      {
        key: 'yingshi',
        name: '萤石',
      },
      {
        key: 'tuya',
        name: '涂鸦',
      },
    ],
    valueType: [
      // 参数类型
      {
        text: '字符串',
        value: '1',
      },
      {
        text: '枚举',
        value: '2',
      },
      {
        text: '连续型',
        value: '3',
      },
    ],
    operationType: [
      // 操作类型
      {
        text: '可读写',
        value: '1',
      },
      {
        text: '只读',
        value: '2',
      },
      {
        text: '只写',
        value: '3',
      },
    ],
  },

  mutations: {
    setcategoryList(state, payload) {
      state.categoryList = payload;
    },
    SetPlatformList(state, payload) {
      state.platformList = payload;
    },
  },

  getters: {},

  actions: {
    async setCategoryList({ commit }, params = {}) {
      params = {
        ...params,
        offset: 1,
        limit: global.MAX_LEN,
      };
      const { errcode, data = {} } = await productManageAsk.getCategory(params);
      if (errcode === 200) {
        commit('setcategoryList', data.categorys);
      }
    },

    async getPlatformList({ commit }, params = {}) {
      const { errcode, data = {} } = await platformManageAsk.getPlatform(params);
      const { list = [] } = data;
      const platformList = list.map(item => {
        return {
          key: item.code,
          name: item.name,
        };
      });
      commit('SetPlatformList', platformList);
    },
  },
};

export default app;
