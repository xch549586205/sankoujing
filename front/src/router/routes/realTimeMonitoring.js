const Index = () => import('viewsPath/realTimeMonitoring/index.vue');
const Main = () => import('viewsPath/realTimeMonitoring/main.vue');

const userManage = [
  {
    // 用电警告
    path: '/realTimeMonitoring',
    name: '实时监测',
    show: true,
    icon: 'iconrenyuanguanli',
    component: Index,
    redirect: '/realTimeMonitoring/main',
    index: 8,
    meta: {
      activeName: '实时监测',
      openName: '实时监测',
    },
    children: [
      {
        // 普通人员
        path: 'main',
        name: 'main',
        show: false,
        icon: '',
        component: Main,
        index: 1,
        meta: {
          activeName: '实时监测',
          openName: '实时监测',
        },
      },
    ],
  },
];

export default [...userManage];
