const Index = () => import('viewsPath/main/index.vue'); // 设备管理

const deviceManage = [
  {
    // 设备管理
    path: '/main',
    name: '首页',
    show: true,
    icon: 'iconshebeiguanli',
    component: Index,
    index: 2,
    meta: {
      activeName: '首页',
      openName: '首页',
    },
  },
];

export default [...deviceManage];
