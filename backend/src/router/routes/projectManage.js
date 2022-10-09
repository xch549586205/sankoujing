const Index = () => import('viewsPath/projectManage/index.vue'); // 项目管理
const List = () => import('viewsPath/projectManage/list/index.vue'); // 项目列表
const Detail = () => import('viewsPath/projectManage/detail/index.vue'); // 项目详情
const BaseInfo = () => import('viewsPath/projectManage/detail/baseInfo.vue'); // 项目详情-基本信息
const WhiteList = () => import('viewsPath/projectManage/detail/whiteList.vue'); // 项目详情-基本信息
const PlatformList = () => import('viewsPath/projectManage/detail/platformList.vue'); // 项目详情-基本信息
const FrontSet = () => import('viewsPath/projectManage/detail/frontSet.vue'); // 项目详情-前端设置
const ProjectBackup = () => import('viewsPath/projectManage/detail/projectBackup.vue'); // 项目详情-项目备份
const ProjectExtend = () => import('viewsPath/projectManage/detail/projectExtend.vue'); // 项目详情-项目备份

const projectManage = [
  {
    // 项目管理
    path: '/projectManage',
    name: '项目管理',
    show: true,
    icon: 'iconxiangmuguanli',
    component: Index,
    index: 1,
    redirect: '/projectManage/list',
    meta: {
      activeName: '项目管理',
      openName: '项目管理',
    },
    children: [
      {
        // 项目详情
        path: 'list',
        name: '项目列表',
        show: false,
        icon: '',
        component: List,
        index: 1,
        meta: {
          activeName: '项目管理',
          openName: '项目管理',
        },
      },
      {
        // 项目详情
        path: 'detail/:id',
        name: '项目详情',
        show: false,
        icon: '',
        component: Detail,
        redirect: 'detail/:id/baseInfo',
        index: 1,
        meta: {
          activeName: '项目管理',
          openName: '项目管理',
        },
        children: [
          {
            // 项目详情-基本信息
            path: 'baseInfo',
            name: 'baseInfo',
            show: false,
            icon: '',
            component: BaseInfo,
            index: 1,
            meta: {
              activeName: '项目管理',
              openName: '项目管理',
            },
          },
          {
            // 项目详情-黑白名单
            path: 'whiteList',
            name: 'whiteList',
            show: false,
            icon: '',
            component: WhiteList,
            index: 1,
            meta: {
              activeName: '项目管理',
              openName: '项目管理',
            },
          },
          {
            // 创建项目-前端设置
            path: 'frontSet',
            name: 'frontSet',
            show: false,
            icon: '',
            component: FrontSet,
            index: 1,
            meta: {
              activeName: '前端设置',
              openName: '前端设置',
            },
          },
          {
            // 创建项目-项目备份
            path: 'projectBackup',
            name: 'projectBackup',
            show: false,
            icon: '',
            component: ProjectBackup,
            index: 1,
            meta: {
              activeName: '项目备份',
              openName: '项目备份',
            },
          },
          {
            // 创建项目-黑白名单
            path: 'platformList',
            name: 'platformList',
            show: false,
            icon: '',
            component: PlatformList,
            index: 1,
            meta: {
              activeName: '绑定平台',
              openName: '绑定平台',
            },
          },
          {
            // 创建项目-黑白名单
            path: 'projectExtend',
            name: 'projectExtend',
            show: false,
            icon: '',
            component: ProjectExtend,
            index: 1,
            meta: {
              activeName: '数据扩展',
              openName: '数据扩展',
            },
          },
        ],
      },
      {
        // 创建项目
        path: 'add',
        name: '创建项目',
        show: false,
        icon: '',
        component: Detail,
        index: 1,
        redirect: 'add/baseInfo',
        meta: {
          activeName: '项目管理',
          openName: '项目管理',
        },
        children: [
          {
            // 创建项目-基本信息
            path: 'baseInfo',
            name: 'baseInfo',
            show: false,
            icon: '',
            component: BaseInfo,
            index: 1,
            meta: {
              activeName: '项目管理',
              openName: '项目管理',
            },
          },
          {
            // 创建项目-黑白名单
            path: 'whiteList',
            name: 'whiteList',
            show: false,
            icon: '',
            component: WhiteList,
            index: 1,
            meta: {
              activeName: '项目管理',
              openName: '项目管理',
            },
          },
          {
            // 创建项目-黑白名单
            path: 'platformList',
            name: 'platformList',
            show: false,
            icon: '',
            component: PlatformList,
            index: 1,
            meta: {
              activeName: '绑定平台',
              openName: '绑定平台',
            },
          },
        ],
      },
    ],
  },
];

export default [...projectManage];
