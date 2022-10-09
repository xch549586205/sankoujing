const Index = () => import('viewsPath/dataDisplay/index.vue'); // 数据展示
const DataPresentation = () => import('viewsPath/dataDisplay/dataPresentation/index.vue'); // 数据图表
const DetailedLog = () => import('viewsPath/dataDisplay/detailedLog/index.vue'); // 详细日志
const WechatLogin = () => import('viewsPath/dataDisplay/detailedLog/wechatLogin.vue'); // 微信登录
const WebLogin = () => import('viewsPath/dataDisplay/detailedLog/webLogin.vue'); // 网页登录
const AppLogin = () => import('viewsPath/dataDisplay/detailedLog/appLogin.vue'); // 安装APP登录
const RemoteControl = () => import('viewsPath/dataDisplay/detailedLog/remoteControl.vue'); // 设备远程控制
const DeviceAlarm = () => import('viewsPath/dataDisplay/detailedLog/deviceAlarm.vue'); // 设备报警
const SystemOperation = () => import('viewsPath/dataDisplay/detailedLog/systemOperation.vue'); // 系统操作
const InstallTask = () => import('viewsPath/dataDisplay/detailedLog/installTask.vue'); // 安装任务
const MaintainTask = () => import('viewsPath/dataDisplay/detailedLog/maintainTask.vue'); // 维护任务
const UserFeedback = () => import('viewsPath/dataDisplay/userFeedback/index.vue'); // 用户反馈
const UserEvaluation = () => import('viewsPath/dataDisplay/userFeedback/userEvaluation.vue'); // 用户评价
const TroubleRepair = () => import('viewsPath/dataDisplay/userFeedback/troubleRepair.vue'); // 故障报修
const DeviceReport= () => import('viewsPath/dataDisplay/detailedLog/deviceReport.vue'); // 数据上报
const SmsReport= () => import('viewsPath/dataDisplay/detailedLog/smsReport.vue'); // 短信通知
const WxgzhReport= () => import('viewsPath/dataDisplay/detailedLog/wxgzhReport.vue'); // 公众号通知
const TimingTask= () => import('viewsPath/dataDisplay/detailedLog/timingTask.vue'); // 定时任务
const SceneTask= () => import('viewsPath/dataDisplay/detailedLog/sceneTask.vue'); // 场景任务
const LinkageTask= () => import('viewsPath/dataDisplay/detailedLog/linkageTask.vue'); // 联动任务
const Order = () => import('viewsPath/dataDisplay/detailedLog/order.vue'); // 订单
const dataDisplay = [
  {
    // 数据展示
    path: '/dataDisplay',
    name: '数据展示',
    show: true,
    icon: 'iconshujuzhanshi',
    component: Index,
    redirect: '/dataDisplay/dataPresentation',
    index: 1,
    meta: {
      activeName: '数据展示',
      openName: '数据展示',
    },
    children: [
      {
        // 数据图表
        path: 'dataPresentation',
        name: 'dataPresentation',
        show: false,
        icon: '',
        component: DataPresentation,
        index: 1,
        meta: {
          activeName: '数据展示',
          openName: '数据展示',
        },
      },
      {
        // 详细日志
        path: 'detailedLog',
        name: 'detailedLog',
        show: false,
        icon: '',
        component: DetailedLog,
        redirect: '/dataDisplay/detailedLog/wechatLogin',
        index: 1,
        meta: {
          activeName: '数据展示',
          openName: '数据展示',
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
              activeName: '数据展示',
              openName: '数据展示',
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
              activeName: '数据展示',
              openName: '数据展示',
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
              activeName: '数据展示',
              openName: '数据展示',
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
              activeName: '数据展示',
              openName: '数据展示',
            },
          },
          {
            // 设备报警
            path: 'deviceAlarm',
            name: 'deviceAlarm',
            show: false,
            icon: '',
            component: DeviceAlarm,
            index: 1,
            meta: {
              activeName: '数据展示',
              openName: '数据展示',
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
              activeName: '数据展示',
              openName: '数据展示',
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
              activeName: '数据展示',
              openName: '数据展示',
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
              activeName: '数据展示',
              openName: '数据展示',
            },
          },
          {
            path: 'deviceReport',
            name: 'deviceReport',
            show: false,
            icon: '',
            component: DeviceReport,
            index: 1,
            meta: {
              activeName: '数据展示',
              openName: '数据展示',
            },
          },
          {
            path: 'smsReport',
            name: 'smsReport',
            show: false,
            icon: '',
            component: SmsReport,
            index: 1,
            meta: {
              activeName: '数据展示',
              openName: '数据展示',
            },
          },
          {
            path: 'wxgzhReport',
            name: 'wxgzhReport',
            show: false,
            icon: '',
            component: WxgzhReport,
            index: 1,
            meta: {
              activeName: '数据展示',
              openName: '数据展示',
            },
          },
          {
            path: 'timingTask',
            name: 'timingTask',
            show: false,
            icon: '',
            component: TimingTask,
            index: 1,
            meta: {
              activeName: '数据展示',
              openName: '数据展示',
            },
          },
          {
            path: 'sceneTask',
            name: 'sceneTask',
            show: false,
            icon: '',
            component: SceneTask,
            index: 1,
            meta: {
              activeName: '数据展示',
              openName: '数据展示',
            },
          },
          {
            path: 'linkageTask',
            name: 'linkageTask',
            show: false,
            icon: '',
            component: LinkageTask,
            index: 1,
            meta: {
              activeName: '数据展示',
              openName: '数据展示',
            },
          },
         {
            path: 'order',
            name: 'order',
            show: false,
            icon: '',
            component: Order,
            index: 1,
            meta: {
              activeName: '数据展示',
              openName: '数据展示',
            },
          },
        ],
      },
      {
        // 用户反馈
        path: 'userFeedback',
        name: 'userFeedback',
        show: false,
        icon: '',
        component: UserFeedback,
        redirect: '/dataDisplay/userFeedback/userEvaluation',
        index: 1,
        meta: {
          activeName: '数据展示',
          openName: '数据展示',
        },
        children: [
          {
            // 用户评价
            path: 'userEvaluation',
            name: 'userEvaluation',
            show: false,
            icon: '',
            component: UserEvaluation,
            index: 1,
            meta: {
              activeName: '数据展示',
              openName: '数据展示',
            },
          },
          {
            // 故障报修
            path: 'troubleRepair',
            name: 'troubleRepair',
            show: false,
            icon: '',
            component: TroubleRepair,
            index: 1,
            meta: {
              activeName: '数据展示',
              openName: '数据展示',
            },
          },
        ],
      },
    ]
  },
];

export default [...dataDisplay];
