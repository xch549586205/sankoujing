const Index = () => import('viewsPath/main/index.vue');
const Main = () => import('viewsPath/main/main.vue');

const main = [
  {
    // 首页
    path: '/main',
    name: '首页',
    show: true,
    icon: 'iconrenyuanguanli',
    component: Index,
    redirect: '/main/main',
    index: 8,
    meta: {
      activeName: '首页',
      openName: '首页',
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
          activeName: '首页',
          openName: '首页',
        },
      },
    ],
  },
];

export default [...main];
