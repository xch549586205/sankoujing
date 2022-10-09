const Index = () => import('viewsPath/deviceManage/index.vue'); // 设备管理
const List = () => import('viewsPath/deviceManage/list/index.vue'); // 设备管理
const Detail = () => import('viewsPath/deviceManage/detail/index.vue'); // 设备详情
const BaseInfo = () => import('viewsPath/deviceManage/detail/baseInfo.vue'); // 基本信息
const CurrentData = () => import('viewsPath/deviceManage/detail/currentData.vue'); // 实时数据
const ParamsHandle = () => import('viewsPath/deviceManage/detail/ParamsHandle.vue'); // 实时数据
const DeviceControl = () => import('viewsPath/deviceManage/detail/deviceControl.vue'); // 实时数据
const ControlLog = () => import('viewsPath/deviceManage/detail/controlLog.vue'); // 实时数据
const EventLog = () => import('viewsPath/deviceManage/detail/eventLog.vue'); // 事件记录
const Freeze = () => import('viewsPath/deviceManage/detail/freeze.vue'); // 冻结
const Timer = () => import('viewsPath/deviceManage/detail/timer.vue'); // 冻结

const ServiceHistory = () => import('viewsPath/deviceManage/detail/serviceHistory.vue'); // 服务记录
const MaintainHistory = () => import('viewsPath/deviceManage/detail/maintainHistory.vue'); // 维修记录

const deviceManage = [
  {
    // 设备管理
    path: '/deviceManage',
    name: '设备管理',
    show: true,
    icon: 'iconshebeiguanli',
    redirect: '/deviceManage/list',
    component: Index,
    index: 2,
    meta: {
      activeName: '设备管理',
      openName: '设备管理',
    },
    children: [
      {
        // 设备列表
        path: 'list',
        name: 'deviceList',
        component: List,
        meta: {
          activeName: '设备管理',
          openName: '设备管理',
        },
      },
      {
        // 设备详情
        path: 'detail/:id',
        name: 'deviceDetail',
        component: Detail,
        redirect: 'detail/:id/baseInfo',
        meta: {
          activeName: '设备管理',
          openName: '设备管理',
        },
        children: [
          {
            // 基本信息
            path: 'baseInfo',
            name: 'baseInfo',
            component: BaseInfo,
            meta: {
              activeName: '设备管理',
              openName: '设备管理',
            },
          },
          {
            // 实时数据
            path: 'currentData',
            name: 'currentData',
            component: CurrentData,
            meta: {
              activeName: '实时数据',
              openName: '实时数据',
            },
          },
          {
            // 实时数据
            path: 'paramsHandle',
            name: 'paramsHandle',
            component: ParamsHandle,
            meta: {
              activeName: '参数读写',
              openName: '参数读写',
            },
          },

          {
            // 远程控制C
            path: 'deviceControl',
            name: 'deviceControl',
            component: DeviceControl,
            meta: {
              activeName: '远程控制',
              openName: '远程控制',
            },
          },
          {
            // 控制日志
            path: 'controlLog',
            name: 'controlLog',
            component: ControlLog,
            meta: {
              activeName: '控制日志',
              openName: '控制日志',
            },
          },
          {
            // 事件记录
            path: 'eventLog',
            name: 'eventLog',
            component: EventLog,
            meta: {
              activeName: '事件记录',
              openName: '事件记录',
            },
          },
          {
            // 事件
            path: 'freeze',
            name: 'freeze',
            component: Freeze,
            meta: {
              activeName: '冻结',
              openName: '冻结',
            },
          },
          {
            // 定时
            path: 'timer',
            name: 'timer',
            component: Timer,
            meta: {
              activeName: '定时',
              openName: '定时',
            },
          },
        ],
      },
    ],
  },
];

export default [...deviceManage];
