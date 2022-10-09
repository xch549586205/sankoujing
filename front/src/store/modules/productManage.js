
const productManage = {
  namespaced: true,
  state: {
    categoryList: [],
    devicetypeList: [{
      "key": "gateway",
      "name": "网关",
      "color": "#1e3124"
    }, {
      "key": "device",
      "name": "微断",
      "color": "#6f847d"
    },
    {
      "key": "subdevice",
      "name": "子设备",
      "color": "#7b8c7c"
    },
    {
      "key": "note",
      "name": "短信服务",
      "color": "#e3dbbf",
    },
    {
      "key": "email",
      "name": "邮件服务",
      "color": "#d3cbaf"
    },
    {
      "key": "official",
      "name": "公众号",
      "color": "#2e62cd"
    },
    {
      "key": "ysvideo",
      "name": "萤石摄像头",
      "color": "#502f16"
    }],
    platformList: [
      {
        "key": "broadlink",
        "name": "博联"
      },
      {
        "key": "alibaba",
        "name": "阿里"
      },
      {
        "key": "jingdong",
        "name": "京东"
      },
      {
        "key": "tencent",
        "name": "腾讯"
      },
      {
        "key": "yuntongxun",
        "name": "云通讯"
      },
      {
        "key": "yingshi",
        "name": "萤石"
      }
    ],
    valueType: [ // 参数类型
      {
        text: '字符串',
        value: '1'
      },
      {
        text: '枚举',
        value: '2'
      },
      {
        text: '连续型',
        value: '3'
      },

    ],
    operationType: [ // 操作类型
      {
        text: '可读写',
        value: '1'
      },
      {
        text: '只读',
        value: '2'
      },
      {
        text: '只写',
        value: '3'
      },
    ],
  },

  mutations: {
  },

  getters: {},

  actions: {
  },
};

export default productManage;
