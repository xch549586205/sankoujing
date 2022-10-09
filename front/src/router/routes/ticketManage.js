const Index = () => import('viewsPath/ticketManage/index.vue'); // 位置管理
const TicketList = () => import('viewsPath/ticketManage/list/ticket.vue'); // 位置管理-列表-站点
const TicketIndex= () => import('viewsPath/ticketManage/detail/index.vue'); // 位置管理-列表-站点
const TicketDetail = () => import('viewsPath/ticketManage/detail/ticket.vue'); // 位置管理-列表-站点
const TicketItemList = () => import('viewsPath/ticketManage/list/item.vue'); // 位置管理-列表-站点
const TicketItemDetail= () => import('viewsPath/ticketManage/detail/item.vue'); // 位置管理-列表-站点
// const TicketDetail = () => import('viewsPath/ticketManage/site/ticket/detail/index.vue'); // 位置管理-列表-站点
// const StoreList = () => import('viewsPath/ticketManage/list/store/index.vue'); // 位置管理-列表-门店
// const Detail = () => import('viewsPath/ticketManage/detail/index.vue'); // 位置管理-详情
// const SiteDetail = () => import('viewsPath/ticketManage/detail/site/index.vue'); // 位置管理-详情-站点
// const StoreDetail = () => import('viewsPath/ticketManage/detail/store/index.vue'); // 位置管理-详情-门店

const ticketManage = [
  {
    // 位置管理
    path: '/ticketManage',
    name: '票据管理',
    show: true,
    icon: 'iconweizhiguanli',
    component: Index,
    index: 9,
    redirect: '/ticketManage/ticket',
    meta: {
      activeName: '位置',
      openName: '位置',
    },
    children: [
      {
        path: 'ticket',
        name: 'ticketList',
        component: TicketList,
        meta: {
          activeName: '票据列表',
          openName: '票据列表',
        },
        children: [
        ]
      },


      {
        path: 'ticket',
        name: 'ticketIndex',
        component: TicketIndex,
        redirect: 'detail',
        meta: {
          activeName: '票据列表',
          openName: '票据列表',
        },
        children: [
      {
        path: 'add',
        name: 'ticketAdd',
        component: TicketDetail,
        meta: {
          activeName: '添加票据',
          openName: '添加票据',
        },
        children: [

        ]
      },
          {
            path: ':ticketid/detail',
            name: 'ticketDetail',
            component: TicketDetail,
            meta: {
              activeName: '票据详情',
              openName: '票据详情',
            },
            children: [
            ]
          },

          {
            path: ':ticketid/item',
            name: 'ticketItemList',
            component: TicketItemList,
            meta: {
              activeName: '商品列表',
              openName: '商品列表',
            },
            children: [
            ]
          },
          {
            path: ':ticketid/item/add',
            name: 'ticketItemAdd',
            component: TicketItemDetail,
            meta: {
              activeName: '商品列表',
              openName: '商品列表',
            },
            children: [
            ]
          },
          {
            path: ':ticketid/item/:itemid',
            name: 'ticketItemDetail',
            component: TicketItemDetail,
            meta: {
              activeName: '票据列表',
              openName: '票据列表',
            },
            children: [
            ]
          }
        ]
      },
    
    ],
  },
];

export default [...ticketManage];
