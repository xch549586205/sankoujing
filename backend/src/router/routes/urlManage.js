const Index = () => import('viewsPath/urlManage/index.vue'); // URL管理
const List = () => import('viewsPath/urlManage/list/index.vue'); // URL列表

const urlManage = [
  {
    // 设备管理
    path: '/urlManage',
    name: 'URL管理',
    show: true,
    icon: 'iconURLguanli',
    component: Index,
    redirect: '/urlManage/list',
    index: 5,
    meta: {
      activeName: 'URL管理',
      openName: 'URL管理',
    },
    children: [
      {
        // URL列表
        path: 'list',
        name: 'URL列表',
        show: false,
        icon: '',
        component: List,
        index: 1,
        meta: {
          activeName: 'URL管理',
          openName: 'URL管理',
        },
      },
    ],
  }
];

export default [...urlManage];
