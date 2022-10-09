/*
 * @Author: your name
 * @Date: 2021-02-19 09:35:30
 * @LastEditTime: 2021-02-19 11:02:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \front\src\router\routes\mapDisplay.js
 */
const Index = () => import('viewsPath/mapDisplay/index.vue'); // 数据展示
const MapDistributed= () => import('viewsPath/mapDisplay/mapDistributed/index.vue'); // 联动任务
const mapDisplay = [
  {
    // 数据展示
    path: '/mapDisplay',
    name: '地图分布',
    show: true,
    icon: 'iconshujuzhanshi',
    component: Index,
    redirect: '/mapDisplay/mapDistributed',
    index: 0,
    meta: {
      activeName: '地图分布',
      openName: '地图分布',
    },
    children: [
      {
        // 数据图表
        path: 'mapDistributed',
        name: 'mapDistributed',
        show: false,
        icon: '',
        component: MapDistributed,
        index: 1,
        meta: {
          activeName: '地图分布',
          openName: '地图分布',
        },
      }
    ]
  },
];

export default [...mapDisplay];
