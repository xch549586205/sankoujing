const Index = () => import('viewsPath/wechatappManage/index.vue'); // 微信应用管理

const wechatappManage = [
  {
    // 微信应用管理
    path: '/wechatappManage',
    name: '微信应用管理',
    show: true,
    icon: 'iconshebeiguanli',
    component: Index,
    index: 7,
    meta: {
      activeName: '微信应用管理',
      openName: '微信应用管理',
    },
  },
];

export default [...wechatappManage];
