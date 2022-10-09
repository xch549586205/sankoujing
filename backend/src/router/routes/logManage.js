const Index = () => import('viewsPath/logManage/index.vue'); // 日志管理
const WechatLogin = () => import('viewsPath/logManage/wechatLogin.vue'); // 微信登录
const WebLogin = () => import('viewsPath/logManage/webLogin.vue'); // 网页登录
const AppLogin = () => import('viewsPath/logManage/appLogin.vue'); // 安装APP登录
const RemoteControl = () => import('viewsPath/logManage/remoteControl.vue'); // 设备远程控制
const SystemOperation = () => import('viewsPath/logManage/systemOperation.vue'); // 系统操作
const InstallTask = () => import('viewsPath/logManage/installTask.vue'); // 安装任务
const MaintainTask = () => import('viewsPath/logManage/maintainTask.vue'); // 维护任务

const logManage = [
  {
    // 日志管理
    path: '/logManage',
    name: '日志管理',
    show: true,
    icon: 'iconrizhiguanli',
    component: Index,
    redirect: '/logManage/wechatLogin',
    index: 4,
    meta: {
      activeName: '日志管理',
      openName: '日志管理',
    },
    children: [
      {
        // 微信登录
        path: 'wechatLogin',
        name: 'wechatLogin',
        show: false,
        icon: '',
        component: WechatLogin,
        index: 1,
        meta: {
          activeName: '日志管理',
          openName: '日志管理',
        },
      },
      {
        // 网页登录
        path: 'webLogin',
        name: 'webLogin',
        show: false,
        icon: '',
        component: WebLogin,
        index: 1,
        meta: {
          activeName: '日志管理',
          openName: '日志管理',
        },
      },
      {
        // 安装APP登录
        path: 'appLogin',
        name: 'appLogin',
        show: false,
        icon: '',
        component: AppLogin,
        index: 1,
        meta: {
          activeName: '日志管理',
          openName: '日志管理',
        },
      },
      {
        // 设备远程控制
        path: 'remoteControl',
        name: 'remoteControl',
        show: false,
        icon: '',
        component: RemoteControl,
        index: 1,
        meta: {
          activeName: '日志管理',
          openName: '日志管理',
        },
      },
      {
        // 系统操作
        path: 'systemOperation',
        name: 'systemOperation',
        show: false,
        icon: '',
        component: SystemOperation,
        index: 1,
        meta: {
          activeName: '日志管理',
          openName: '日志管理',
        },
      },
      {
        // 安装任务
        path: 'installTask',
        name: 'installTask',
        show: false,
        icon: '',
        component: InstallTask,
        index: 1,
        meta: {
          activeName: '日志管理',
          openName: '日志管理',
        },
      },
      {
        // 维护任务
        path: 'maintainTask',
        name: 'maintainTask',
        show: false,
        icon: '',
        component: MaintainTask,
        index: 1,
        meta: {
          activeName: '日志管理',
          openName: '日志管理',
        },
      },
    ]
  },
];

export default [...logManage];
