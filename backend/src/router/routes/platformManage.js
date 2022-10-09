const Index = () => import('viewsPath/platformManage/index.vue'); // URL管理
const List = () => import('viewsPath/platformManage/list/index.vue'); // URL列表

const platformManage = [
  {
    // 设备管理
    path: '/platformManage',
    name: '平台管理',
    show: true,
    icon: 'iconURLguanli',
    component: Index,
    redirect: '/platformManage/list',
    index: 5,
    meta: {
      activeName: '平台管理',
      openName: '平台管理',
    },
    children: [
      {
        // URL列表
        path: 'list',
        name: '平台列表',
        show: false,
        icon: '',
        component: List,
        index: 1,
        meta: {
          activeName: '平台列表',
          openName: '平台列表',
        },
      },
    ],
  }
];

export default [...platformManage];
