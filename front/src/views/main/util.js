import moment from 'moment';

export const getKwFromDay = (dayForamt, list) => {
  const _data = list.filter((d) => moment(d.eventtime).format('YYYY-MM-DD') === dayForamt)[0] || {};
  return _data.RtlWh * 1 + _data.SupWh * 1 || 0;
};
export const getKwFromMonth = (monthForamt, list) => {
  const _data = list.filter((d) => moment(d.eventtime).format('YYYY-MM') === monthForamt)[0] || {};
  return _data.RtlWh * 1 + _data.SupWh * 1 || 0;
};
export const getWarningFromDay = (dayForamt, list) => {
  const _data =
    list.filter((d) => moment(d.createtime).format('YYYY-MM-DD') === dayForamt)[0] || {};
  return _data.totalcnt || 0;
};
export const getWarningFromMonth = (dayForamt, list) => {
  const _data = list.filter((d) => moment(d.createtime).format('YYYY-MM') === dayForamt)[0] || {};
  return _data.totalcnt || 0;
};
export function getStr(deviceList) {
  // "value": "%\"Wave_rcd\":\"1\"%,%\"Sw_cluuidose\":\"1\"%"
  let _str = '';
  deviceList.map((deviceid) => {
    // eslint-disable-next-line no-useless-escape
    _str += `%\"uuid\":\"${deviceid}\"%,`;
  });
  return _str.slice(0, _str.length - 1);
}
export function getStrReport(deviceList) {
  // "value": "%\"Wave_rcd\":\"1\"%,%\"Sw_cluuidose\":\"1\"%"
  let _str = '';
  deviceList.map((deviceid) => {
    // eslint-disable-next-line no-useless-escape
    _str += `%\"account\":\"${deviceid}\"%,`;
  });
  return _str.slice(0, _str.length - 1);
}
export const warningList = [
  {
    name: 'A相过压告警',
    param: 'Alm_ov_phsA',
    group: '过压告警',
  },
  {
    name: 'B相过压告警',
    param: 'Alm_ov_phsB',
    group: '过压告警',
  },
  {
    name: 'C相过压告警',
    param: 'Alm_ov_phsC',
    group: '过压告警',
  },
  {
    name: '过压动作',
    param: 'Act_ov',
    group: '过压告警',
  },
  {
    name: 'A相欠压告警',
    param: 'Alm_uv_phsA',
    group: '欠压告警',
  },
  {
    name: 'B相欠压告警',
    param: 'Alm_uv_phsB',
    group: '欠压告警',
  },
  {
    name: 'C相欠压告警',
    param: 'Alm_uv_phsC',
    group: '欠压告警',
  },
  {
    name: '欠压动作',
    param: 'Act_uv',
    group: '欠压告警',
  },
  {
    name: 'A相过流Ⅰ段告警',
    param: 'Alm_oc1_phsA',
    group: '过流告警',
  },
  {
    name: 'B相过流Ⅰ段告警',
    param: 'Alm_oc1_phsB',
    group: '过流告警',
  },
  {
    name: 'C相过流Ⅰ段告警',
    param: 'Alm_oc1_phsC',
    group: '过流告警',
  },
  {
    name: 'A相过流Ⅱ段告警',
    param: 'Alm_oc2_phsA',
    group: '过流告警',
  },
  {
    name: 'B相过流Ⅱ段告警',
    param: 'Alm_oc2_phsB',
    group: '过流告警',
  },
  {
    name: 'C相过流Ⅱ段告警',
    param: 'Alm_oc2_phsC',
    group: '过流告警',
  },
  {
    name: '过流Ⅰ段动作',
    param: 'Act_oc1',
    group: '过流告警',
  },
  {
    name: '过流Ⅱ段动作',
    param: 'Act_oc2',
    group: '过流告警',
  },
  {
    name: 'A相功率过载告警',
    param: 'Alm_op_phsA',
    group: '过载告警',
  },
  {
    name: 'B相功率过载告警',
    param: 'Alm_op_phsB',
    group: '过载告警',
  },
  {
    name: 'C相功率过载告警',
    param: 'Alm_op_phsC',
    group: '过载告警',
  },
  {
    name: '功率过载动作',
    param: 'Act_op',
    group: '过载告警',
  },
  {
    name: 'A相断相告警',
    param: 'Alm_lackV_phsA',
    group: '断相告警',
  },
  {
    name: 'B相断相告警',
    param: 'Alm_lackV_phsB',
    group: '断相告警',
  },
  {
    name: 'C相断相告警',
    param: 'Alm_lackV_phsC',
    group: '断相告警',
  },
  {
    name: '断相动作',
    param: 'Act_lackV_phase',
    group: '断相告警',
  },
  {
    name: 'A相短路故障',
    param: 'Shortcircuit_phsA',
    group: '短路告警',
  },
  {
    name: 'B相短路故障',
    param: 'Shortcircuit_phsB',
    group: '短路告警',
  },
  {
    name: 'C相短路故障',
    param: 'Shortcircuit_phsC',
    group: '短路告警',
  },
  {
    name: 'A相温度过热告警',
    param: 'Alm_ot_phsA',
    group: '温度告警',
  },
  {
    name: 'B相温度过热告警',
    param: 'Alm_ot_phsB',
    group: '温度告警',
  },
  {
    name: 'C相温度过热告警',
    param: 'Alm_ot_phsC',
    group: '温度告警',
  },
  {
    name: '温度过热动作',
    param: 'Act_ot',
    group: '温度告警',
  },
  {
    name: 'A相电弧故障告警',
    param: 'Alm_arc_phsA',
    group: '电弧告警',
  },
  {
    name: 'B相电弧故障告警',
    param: 'Alm_arc_phsB',
    group: '电弧告警',
  },
  {
    name: 'C相电弧故障告警',
    param: 'Alm_arc_phsC',
    group: '电弧告警',
  },
  {
    name: '电弧故障动作',
    param: 'Act_arc',
    group: '电弧告警',
  },
  {
    name: '漏电故障',
    param: 'Leak',
    group: '漏电故障',
  },
  {
    name: '零线过流Ⅰ段告警',
    param: 'Alm_oz1',
    group: '漏电故障',
  },
  {
    name: '零线过流Ⅱ段告警',
    param: 'Alm_oz2',
    group: '漏电故障',
  },
  {
    name: '零线过流Ⅰ段动作',
    param: 'Act_oz1',
    group: '漏电故障',
  },
  {
    name: '零线过流Ⅱ段动作',
    param: 'Act_oz2',
    group: '漏电故障',
  },
  {
    name: '逆相序告警',
    param: 'Alm_seq_V',
    group: '逆相序告警',
  },
  {
    name: '逆相序动作',
    param: 'Act_seq_V',
    group: '逆相序告警',
  },
  {
    name: '电压不平衡告警',
    param: 'Alm_imb_V',
    group: '三相不平衡',
  },
  {
    name: '电压不平衡动作',
    param: 'Act__imb_V',
    group: '三相不平衡',
  },
  {
    name: '电流不平衡告警',
    param: 'Alm_imb_A',
    group: '三相不平衡',
  },
  {
    name: '电流不平衡动作',
    param: 'Act_imb_A',
    group: '三相不平衡',
  },
  {
    name: '微断分位',
    param: 'Sw_open',
    group: '分合闸告警',
  },
  {
    name: '微断合位',
    param: 'Sw_close',
    group: '分合闸告警',
  },
  {
    name: '检修告警',
    param: 'Local',
    group: '检修告警',
  },
  {
    name: '重合闸告警',
    param: 'Reclose',
    group: '重合闸告警',
  },
  {
    name: '漏电自检告警',
    param: 'Leak_test',
    group: '漏电自检告警',
  },
  {
    name: '停电告警',
    param: 'PwrOff',
    group: '停电告警',
  },
  {
    name: '上电告警',
    param: 'PwrOn',
    group: '上电告警',
  },
];
