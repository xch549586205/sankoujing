const Index = () => import('viewsPath/productUpdate/index.vue'); // 产品管理
const EditionManage = () => import('viewsPath/productUpdate/editionManage.vue'); // 产品列表
const DeviceUpdate = () => import('viewsPath/productUpdate/DeviceUpdate.vue'); // 产品详情
const EditionDetail = () => import('viewsPath/productUpdate/editionDetail.vue'); // 产品详情
const Main = () => import('viewsPath/productUpdate/main.vue'); // 产品详情

const productManage = [
  {
    // 远程升级
    path: '/productUpdate',
    name: '远程升级',
    show: true,
    icon: 'iconchanpinguanli',
    component: Main,
    index: 3,
    redirect: '/productUpdate/editionManage',
    meta: {
      activeName: '版本管理',
      openName: '版本管理',
    },
    children: [
      {
        // 版本管理
        path: 'editionManage',
        name: '版本管理',
        show: false,
        icon: '',
        component: EditionManage,
        index: 1,
        meta: {
          activeName: '版本管理',
          openName: '版本管理',
        },
      },
      {
        // 设备升级
        path: 'deviceUpdate',
        name: '设备升级',
        show: false,
        icon: '',
        component: DeviceUpdate,
        index: 1,
        meta: {
          activeName: '设备升级',
          openName: '设备升级',
        },
      },
    ],
  },
  {
    // 远程升级
    path: '/productUpdate/editionDetail',
    name: '版本详情',
    show: false,
    icon: 'editionDetail',
    component: EditionDetail,
    meta: {
      activeName: '版本详情',
      openName: '版本详情',
    },
  },
];

export default [...productManage];
