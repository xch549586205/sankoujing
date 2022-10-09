const Index = () => import('viewsPath/wechatuserManage/index.vue'); // 位置管理
const Order = () => import('viewsPath/wechatuserManage/order.vue'); // 位置管理-列表-站点
const User = () => import('viewsPath/wechatuserManage/user.vue'); // 位置管理-列表-站点
const LoginLog = () => import('viewsPath/wechatuserManage/loginlog.vue'); // 位置管理-列表-站点
const ScoreLog = () => import('viewsPath/wechatuserManage/scorelog.vue'); // 位置管理-列表-站点
const GameLog = () => import('viewsPath/wechatuserManage/gamelog.vue'); // 位置管理-列表-站点

const wechatuserManage = [
  {
    // 位置管理
    path: '/wechatuserManage',
    name: '用户管理',
    show: true,
    icon: 'iconweizhiguanli',
    component: Index,
    index: 10,
    redirect: '/wechatuserManage/user',
    meta: {
      activeName: '位置',
      openName: '位置',
    },
    children: [
      {
        path: 'user',
        name: 'wechatuser',
        component: User,
        meta: {
          activeName: '用户列表',
          openName: '用户列表',
        },
      },
      {
        path: 'order',
        name: 'wechatorder',
        component: Order,
        meta: {
          activeName: '历史订单',
          openName: '历史订单',
        },
      },
      {
        path: 'loginlog',
        name: 'wechatloginlog',
        component: LoginLog,
        meta: {
          activeName: '登录日志',
          openName: '登录日志',
        },
      },
      {
        path: 'scorelog',
        name: 'wechatscorelog',
        component: ScoreLog,
        meta: {
          activeName: '积分日志',
          openName: '积分日志',
        },
      },
      {
        path: 'gamelog',
        name: 'wechatgamelog',
        component: GameLog,
        meta: {
          activeName: '游戏日志',
          openName: '游戏日志',
        },
      },
    ],
  },
];

export default [...wechatuserManage];
