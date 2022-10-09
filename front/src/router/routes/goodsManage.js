const Index = () => import('viewsPath/goodsManage/index.vue'); // 位置管理
const GoodsList = () => import('viewsPath/goodsManage/list/goods.vue'); // 位置管理-列表-站点
const GoodsDetail = () => import('viewsPath/goodsManage/detail/goods.vue'); // 位置管理-列表-站点
// const GoodsDetail = () => import('viewsPath/goodsManage/site/goods/detail/index.vue'); // 位置管理-列表-站点
// const StoreList = () => import('viewsPath/goodsManage/list/store/index.vue'); // 位置管理-列表-门店
// const Detail = () => import('viewsPath/goodsManage/detail/index.vue'); // 位置管理-详情
// const SiteDetail = () => import('viewsPath/goodsManage/detail/site/index.vue'); // 位置管理-详情-站点
// const StoreDetail = () => import('viewsPath/goodsManage/detail/store/index.vue'); // 位置管理-详情-门店

const goodsManage = [
  {
    // 位置管理
    path: '/goodsManage',
    name: '商品管理',
    show: true,
    icon: 'iconweizhiguanli',
    component: Index,
    index: 9,
    redirect: '/goodsManage/goods',
    meta: {
      activeName: '位置',
      openName: '位置',
    },
    children: [
      {
        path: 'goods',
        name: 'goodsList',
        component: GoodsList,
        meta: {
          activeName: '商品列表',
          openName: '商品列表',
        },
        children: [
        ]
      },
      {
        path: 'goods/add',
        name: 'goodsAdd',
        component: GoodsDetail,
        meta: {
          activeName: '添加商品',
          openName: '添加商品',
        },
        children: [

        ]
      },
      {
        path: 'goods/:goodsid',
        name: 'goodsDetail',
        component: GoodsDetail,
        meta: {
          activeName: '商品详情',
          openName: '商品详情',
        },
        children: [
        ]
      },
    ],
  },
];

export default [...goodsManage];
