const Index = () => import('viewsPath/electricalWarning/index.vue');
const Main = () => import('viewsPath/electricalWarning/main.vue');

const userManage = [
  {
    // 用电警告
    path: '/electricalWarning',
    name: '用电警告',
    show: true,
    icon: 'iconrenyuanguanli',
    component: Index,
    redirect: '/electricalWarning/main',
    index: 8,
    meta: {
      activeName: '用电警告',
      openName: '用电警告',
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
          activeName: '用电警告',
          openName: '用电警告',
        },
      },
    ],
  },
];

export default [...userManage];
