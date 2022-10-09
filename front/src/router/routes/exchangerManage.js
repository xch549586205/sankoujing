const Index = () => import('viewsPath/exchangerManage/index.vue'); // 位置管理
const ExchangerList = () => import('viewsPath/exchangerManage/list/exchanger.vue'); // 位置管理-列表-站点
const ExchangerDetail = () => import('viewsPath/exchangerManage/detail/exchanger.vue'); // 位置管理-列表-站点
const ExchangerCellDetail = () => import('viewsPath/exchangerManage/detail/cell.vue'); // 位置管理-列表-站点
// const ExchangerDetail = () => import('viewsPath/exchangerManage/site/exchanger/detail/index.vue'); // 位置管理-列表-站点
// const StoreList = () => import('viewsPath/exchangerManage/list/store/index.vue'); // 位置管理-列表-门店
// const Detail = () => import('viewsPath/exchangerManage/detail/index.vue'); // 位置管理-详情
// const SiteDetail = () => import('viewsPath/exchangerManage/detail/site/index.vue'); // 位置管理-详情-站点
// const StoreDetail = () => import('viewsPath/exchangerManage/detail/store/index.vue'); // 位置管理-详情-门店

const exchangerManage = [
  {
    // 位置管理
    path: '/exchangerManage',
    name: '积分管理',
    show: true,
    icon: 'iconweizhiguanli',
    component: Index,
    index: 9,
    redirect: '/exchangerManage/exchanger',
    meta: {
      activeName: '位置',
      openName: '位置',
    },
    children: [
      {
        path: 'exchanger',
        name: 'exchangerList',
        component: ExchangerList,
        meta: {
          activeName: '积分兑换列表',
          openName: '积分兑换列表',
        },
        children: [
        ]
      },
      {
        path: 'exchanger/add',
        name: 'exchangerAdd',
        component: ExchangerDetail,
        meta: {
          activeName: '添加积分兑换',
          openName: '添加积分兑换',
        },
        children: [

        ]
      },
      {
        path: 'exchanger/:exchangerid',
        name: 'exchangerDetail',
        component: ExchangerDetail,
        meta: {
          activeName: '积分兑换详情',
          openName: '积分兑换详情',
        },
        children: [
        ]
      },
      {
        path: 'exchanger/:exchangerid/cell/:no',
        name: 'exchangerCellDetail',
        component: ExchangerCellDetail,
        meta: {
          activeName: '奖品详情',
          openName: '奖品详情',
        },
        children: [
        ]
      },
    ],
  },
];

export default [...exchangerManage];
