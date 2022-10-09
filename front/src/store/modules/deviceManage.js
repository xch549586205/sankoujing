/*
 * @Description: In User Settings Edit
 * @Author: your key
 * @Date: 2019-07-04 14:59:10
 * @LastEditTime: 2021-02-24 11:36:48
 * @LastEditors: Please set LastEditors
 */
import service from 'servicePath/index';
import app from './app';
import global from 'commonPath/global';

const { deviceManageAsk } = service;
const deviceManage = {
  namespaced: true,
  state: {
    deviceStatusArray: [
      {
        key: '0',
        text: '未安装',
      },
      {
        key: '1',
        text: '已安装',
      },
      {
        key: '2',
        text: '已验证',
      },
      {
        key: '3',
        text: '故障中',
      },
      {
        key: '4',
        text: '已维护',
      },
    ],
    onlineStatus: [
      {
        key: '0',
        text: '离线',
      },
      {
        key: '1',
        text: '在线',
      },
    ],
    devicetypeList: [
      {
        key: 'gateway',
        text: '网关',
        color: '#1e3124',
      },
      {
        key: 'device',
        text: '微断',
        color: '#6f847d',
      },
      {
        key: 'subdevice',
        text: '子设备',
        color: '#7b8c7c',
      },
      {
        key: 'note',
        text: '短信服务',
        color: '#e3dbbf',
      },
      {
        key: 'email',
        text: '邮件服务',
        color: '#d3cbaf',
      },
      {
        key: 'official',
        text: '公众号',
        color: '#2e62cd',
      },
      {
        key: 'ysvideo',
        text: '萤石摄像头',
        color: '#502f16',
      },
    ],
    runningStatus: [
      {
        key: '-1',
        text: '故障中',
      },
      {
        key: '0',
        text: '空闲',
      },
      {
        key: '1',
        text: '使用',
      },
    ],
    valueType: {
      string: '1', // 字符串
      enum: '2', // 枚举
      range: '3', // 连续型
    },
    deviceInfo: {},
    attributes: [],
    productInfo: {},
    confs: [],
    currentWatchDeviceInfo: {},
    renderDeviceList: [],
  },
  mutations: {
    // 更新设备状态
    updateDevice(state, payload) {
      state.deviceInfo = Object.assign({}, state.deviceInfo, payload);
    },
    // 当前正在详情页查看的deviceinfdo
    updateRenderDeviceList(state, payload) {
      state.renderDeviceList = payload;
    },
    // 当前正在详情页查看的deviceinfdo
    updateCurrentWatchDeviceInfo(state, payload) {
      state.currentWatchDeviceInfo = Object.assign({}, state.currentWatchDeviceInfo, payload);
    },
    // 更新设备属性
    updateAttributes(state, payload) {
      state.attributes = payload;
    },
    // 更新设备属性
    updateConfs(state, payload) {
      state.confs = payload;
    },
    // 更新设备属性
    updateProduct(state, payload) {
      if (payload && payload.h5url != undefined && payload.h5url != '') {
        payload.devicetype = 'h5page';
      }
      state.productInfo = payload;
    },
  },

  getters: {
    formatConfs: (state) => {
      const { confs = [] } = state;
      if (confs) {
        return confs.map((v) => {
          return {
            key: v.name,
            text: v.remark,
            attrtype: 'front',
          };
        });
      }
    },
    // 格式化产品属性
    formatAttributes: (state) => {
      const { attributes = [] } = state;
      if (attributes) {
        const operateAttr = attributes.filter((v) => v.operationtype !== '2') || []; // 过滤只读属性
        // console.log(attributes);
        const newAttributes = operateAttr.map((v) => {
          const { valuetype } = v;
          const item = {
            text: v.displayname,
            key: v.openproxy,
            valuetype,
            status: [],
            attrtype: 'device',
          };
          // 枚举 | 字符串
          if (valuetype === state.valueType.enum) {
            v.openvalue = v.openvalue.replace(/，/g, ',');
            v.openname = v.openname.replace(/，/g, ',');
            const values = (v.openvalue && v.openvalue.split(',')) || [];
            const texts = (v.openname && v.openname.split(',')) || [];
            item.status = values.map((k, index) => ({ text: texts[index] || k, value: k }));
          }
          if (valuetype === state.valueType.string) {
            item.status = [{ text: v.openproxy || v.openvalue, value: v.openvalue }];
          }
          // 连续型
          if (valuetype === state.valueType.range) {
            const range = (v.openvalue && v.openvalue.split('-')) || [];
            if (range) {
              item.min = parseInt(range[0]);
              item.max = parseInt(range[1]);
              item.step = 1;
            }
          }
          return item;
        });
        console.log('newAttributes', newAttributes);
        return newAttributes;
      }
    },
  },
  actions: {
    getProductAttributes({ commit, rootState }, payload) {
      let projectid =
        payload.projectid != undefined ? payload.projectid : rootState.app.projectInfo.id;
      deviceManageAsk
        // .getProductAttributes(payload)
        .getProductDetail({ id: payload.productid, projectid: projectid + '' })
        .then((result) => {
          const { errcode, data = {} } = result;
          if (errcode === 200) {
            const { confs = [], attributes = [] } = data;
            commit('updateAttributes', attributes);
            commit('updateConfs', confs);
            commit('updateProduct', data);
          }
        })
        .catch((e) => {
          console.error(e);
        });
    },
    getProduct({ commit }, payload) {
      deviceManageAsk
        .getProduct(payload)
        .then((result) => {
          const { errcode, data = {} } = result;
          if (errcode === 200) {
            const { productsinfo = [] } = data;
            commit('updateProduct', productsinfo[0] || {});
          }
        })
        .catch((e) => {
          console.error(e);
        });
    },
  },
};

export default deviceManage;
