const Index = () => import('viewsPath/productManage/index.vue'); // 产品管理
const List = () => import('viewsPath/productManage/list/index.vue'); // 产品列表
const ProductDetail = () => import('viewsPath/productManage/detail/productDetail.vue'); // 产品详情

const productManage = [
  {
    // 产品管理
    path: '/productManage',
    name: '产品管理',
    show: true,
    icon: 'iconchanpinguanli',
    component: Index,
    index: 3,
    redirect: '/productManage/list',
    meta: {
      activeName: '产品管理',
      openName: '产品管理',
    },
    children: [
      {
        // 产品列表
        path: 'list',
        name: '产品列表',
        show: false,
        icon: '',
        component: List,
        index: 1,
        meta: {
          activeName: '产品管理',
          openName: '产品管理',
        },
      },
      {
        // 产品详情
        path: 'detail',
        name: '产品详情',
        show: false,
        icon: '',
        component: ProductDetail,
        index: 1,
        meta: {
          activeName: '产品管理',
          openName: '产品管理',
        },
      },
      {
        // 添加产品
        path: 'add',
        name: '添加产品',
        show: false,
        icon: '',
        component: ProductDetail,
        index: 1,
        meta: {
          activeName: '产品管理',
          openName: '产品管理',
        },
      },
    ],
  },
];

export default [...productManage];
