import service from 'servicePath/index';

const { deviceManageAsk, productManageAsk, groupManageAsk } = service;

export async function getGroup(id = null) {
  const params = {
    id,
  };
  try {
    const reuslt = await groupManageAsk.getGroup(params);
    const { errcode, data = [] } = reuslt;
    if (errcode === 200) {
      return data;
    }
    return [];
  } catch (error) {
    return [];
  }
}

export async function getCascaderOptions() {
  try {
    const level1List = await getGroup();
    return await Promise.all(
      level1List.map(async (level1) =>
        (async () => {
          const child = await getGroup(level1.id);
          return {
            value: level1.id,
            label: level1.name,
            children: child
              ? child.map((_child) => ({
                  value: _child.id,
                  label: _child.name,
                }))
              : [],
          };
        })()
      )
    );
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getDevice(params) {
  try {
    const { data = {} } = await deviceManageAsk.getDevice({
      displayname: '',
      limit: 10000,
      location: '',
      offset: 1,
      online: null,
      seq: 1,
      ...params,
    });
    return data;
  } catch (error) {
    console.error(error);
    return {};
  }
}
export const getQuantity = function (remark) {};
export async function getAllGatewayList(params) {
  try {
    const { data = {} } = await deviceManageAsk.getDevice({
      displayname: '',
      groupid: -1,
      limit: 10000,
      location: '',
      offset: 1,
      online: null,
      seq: 1,
      devicetype: 'gateway',
      ...params,
    });
    return data.deviceInfos.filter((p) => p.devicetype === 'gateway');
  } catch (error) {
    console.error(error);
    return {};
  }
}

const p1p2Events = [
  {
    value: 'evt_close',
    label: '微断合闸事件',
    sub: [
      {
        key: 'SupWh',
        name: '正向有功总电能',
      },
      {
        key: 'RtlWh',
        name: '反向有功总电能',
      },
      {
        key: 'Tmp',
        name: '端子温度',
      },
      {
        key: 'PhV_adc',
        name: '相电压(ADC)',
      },
      {
        key: 'PhA_adc',
        name: '相保护电流(ADC)',
      },
      {
        key: 'A_neut_adc',
        name: '零线电流',
      },
      {
        key: 'TotW',
        name: '总有功功率',
      },
      {
        key: 'TotVAr',
        name: '总无功功率',
      },
      {
        key: 'TotPF',
        name: '总功率因数',
      },
      {
        key: 'TotPF',
        name: '总功率因数',
      },
      {
        key: 'op_code',
        name: '操作码',
      },
    ],
  },
  {
    value: 'evt_open',
    label: '微断拉闸事件',
    sub: [
      {
        key: 'SupWh',
        name: '正向有功总电能',
      },
      {
        key: 'RtlWh',
        name: '反向有功总电能',
      },
      {
        key: 'Tmp',
        name: '端子温度',
      },
      {
        key: 'PhV_adc',
        name: '相电压(ADC)',
      },
      {
        key: 'PhA_adc',
        name: '相保护电流(ADC)',
      },
      {
        key: 'A_neut_adc',
        name: '零线电流',
      },
      {
        key: 'TotW',
        name: '总有功功率',
      },
      {
        key: 'TotVAr',
        name: '总无功功率',
      },
      {
        key: 'TotPF',
        name: '总功率因数',
      },
      {
        key: 'TotPF',
        name: '总功率因数',
      },
      {
        key: 'op_code',
        name: '操作码',
      },
    ],
  },
  {
    value: 'evt_lock',
    label: '微断闭锁事件',
    sub: [
      {
        key: 'SupWh',
        name: '正向有功总电能',
      },
      {
        key: 'RtlWh',
        name: '反向有功总电能',
      },
      {
        key: 'Tmp',
        name: '端子温度',
      },
      {
        key: 'PhV_adc',
        name: '相电压(ADC)',
      },
      {
        key: 'PhA_adc',
        name: '相保护电流(ADC)',
      },
      {
        key: 'A_neut_adc',
        name: '零线电流',
      },
      {
        key: 'TotW',
        name: '总有功功率',
      },
      {
        key: 'TotVAr',
        name: '总无功功率',
      },
      {
        key: 'TotPF',
        name: '总功率因数',
      },
      {
        key: 'TotPF',
        name: '总功率因数',
      },
      {
        key: 'op_code',
        name: '操作码',
      },
    ],
  },
  {
    value: 'evt_abnomal',
    label: '微断异常事件',
    sub: [
      {
        key: 'SupWh',
        name: '正向有功总电能',
      },
      {
        key: 'RtlWh',
        name: '反向有功总电能',
      },
      {
        key: 'ab_code',
        name: '异常码',
      },
    ],
  },
  {
    value: 'evt_upgrade',
    label: '软件升级事件',
    sub: [
      {
        key: 'SupWh',
        name: '正向有功总电能',
      },
      {
        key: 'RtlWh',
        name: '反向有功总电能',
      },
      {
        key: 'sv',
        name: '升级软件版本信息',
      },
      {
        key: 'op_code',
        name: '操作码',
      },
    ],
  },
  {
    value: 'evt_para_mod',
    label: '参数修改事件',
    sub: [
      {
        key: 'param_no',
        name: '修改的参数类型',
      },
      {
        key: 'op_code',
        name: '操作码',
      },
    ],
  },
  {
    value: 'evt_clr',
    label: '微断清零事件',
    sub: [
      {
        key: 'SupWh',
        name: '正向有功总电能',
      },
      {
        key: 'RtlWh',
        name: '反向有功总电能',
      },
      {
        key: 'op_code',
        name: '操作码',
      },
    ],
  },
  {
    value: 'evt_reboot',
    label: '设备重启事件',
    sub: [
      {
        key: 'SupWh',
        name: '正向有功总电能',
      },
      {
        key: 'RtlWh',
        name: '反向有功总电能',
      },
    ],
  },
  {
    value: 'evt_leak_test',
    label: '漏电自检事件',
    sub: [
      {
        key: 'SupWh',
        name: '正向有功总电能',
      },
      {
        key: 'RtlWh',
        name: '反向有功总电能',
      },
      {
        key: 'op_code',
        name: '操作码',
      },
    ],
  },
  {
    value: 'evt_pwroff',
    label: '微断停电事件',
    sub: [
      {
        key: 'SupWh',
        name: '正向有功总电能',
      },
      {
        key: 'RtlWh',
        name: '反向有功总电能',
      },
      {
        key: 'Tmp',
        name: '端子温度',
      },
      {
        key: 'PhV_adc',
        name: '相电压(ADC)',
      },
      {
        key: 'PhA_adc',
        name: '相保护电流(ADC)',
      },
      {
        key: 'A_neut_adc',
        name: '零线电流',
      },
      {
        key: 'TotW',
        name: '总有功功率',
      },
      {
        key: 'TotVAr',
        name: '总无功功率',
      },
      {
        key: 'TotPF',
        name: '总功率因数',
      },
      {
        key: 'TotPF',
        name: '总功率因数',
      },
    ],
  },
  {
    value: 'evt_pwron',
    label: '微断上电事件',
    sub: [
      {
        key: 'SupWh',
        name: '正向有功总电能',
      },
      {
        key: 'RtlWh',
        name: '反向有功总电能',
      },
      {
        key: 'Tmp',
        name: '端子温度',
      },
      {
        key: 'PhV_adc',
        name: '相电压(ADC)',
      },
      {
        key: 'PhA_adc',
        name: '相保护电流(ADC)',
      },
      {
        key: 'A_neut_adc',
        name: '零线电流',
      },
      {
        key: 'TotW',
        name: '总有功功率',
      },
      {
        key: 'TotVAr',
        name: '总无功功率',
      },
      {
        key: 'TotPF',
        name: '总功率因数',
      },
      {
        key: 'TotPF',
        name: '总功率因数',
      },
    ],
  },
  {
    value: 'evt_uv',
    label: '微断欠压事件',
    sub: [
      {
        key: 'SupWh',
        name: '正向有功总电能',
      },
      {
        key: 'RtlWh',
        name: '反向有功总电能',
      },
      {
        key: 'Tmp',
        name: '端子温度',
      },
      {
        key: 'PhV_adc',
        name: '相电压(ADC)',
      },
      {
        key: 'PhA_adc',
        name: '相保护电流(ADC)',
      },
      {
        key: 'A_neut_adc',
        name: '零线电流',
      },
      {
        key: 'TotW',
        name: '总有功功率',
      },
      {
        key: 'TotVAr',
        name: '总无功功率',
      },
      {
        key: 'TotPF',
        name: '总功率因数',
      },
      {
        key: 'TotPF',
        name: '总功率因数',
      },
    ],
  },
  {
    value: 'evt_ov',
    label: '微断过压事件',
    sub: [
      {
        key: 'SupWh',
        name: '正向有功总电能',
      },
      {
        key: 'RtlWh',
        name: '反向有功总电能',
      },
      {
        key: 'Tmp',
        name: '端子温度',
      },
      {
        key: 'PhV_adc',
        name: '相电压(ADC)',
      },
      {
        key: 'PhA_adc',
        name: '相保护电流(ADC)',
      },
      {
        key: 'A_neut_adc',
        name: '零线电流',
      },
      {
        key: 'TotW',
        name: '总有功功率',
      },
      {
        key: 'TotVAr',
        name: '总无功功率',
      },
      {
        key: 'TotPF',
        name: '总功率因数',
      },
      {
        key: 'TotPF',
        name: '总功率因数',
      },
    ],
  },
  {
    value: 'evt_op',
    label: '端子过热事件',
    sub: [
      {
        key: 'SupWh',
        name: '正向有功总电能',
      },
      {
        key: 'RtlWh',
        name: '反向有功总电能',
      },
      {
        key: 'Tmp',
        name: '端子温度',
      },
      {
        key: 'PhV_adc',
        name: '相电压(ADC)',
      },
      {
        key: 'PhA_adc',
        name: '相保护电流(ADC)',
      },
      {
        key: 'A_neut_adc',
        name: '零线电流',
      },
      {
        key: 'TotW',
        name: '总有功功率',
      },
      {
        key: 'TotVAr',
        name: '总无功功率',
      },
      {
        key: 'TotPF',
        name: '总功率因数',
      },
      {
        key: 'TotPF',
        name: '总功率因数',
      },
    ],
  },
  {
    value: 'evt_ot',
    label: '重合闸事件',
    sub: [
      {
        key: 'SupWh',
        name: '正向有功总电能',
      },
      {
        key: 'RtlWh',
        name: '反向有功总电能',
      },
      {
        key: 'Tmp',
        name: '端子温度',
      },
      {
        key: 'PhV_adc',
        name: '相电压(ADC)',
      },
      {
        key: 'PhA_adc',
        name: '相保护电流(ADC)',
      },
      {
        key: 'A_neut_adc',
        name: '零线电流',
      },
      {
        key: 'TotW',
        name: '总有功功率',
      },
      {
        key: 'TotVAr',
        name: '总无功功率',
      },
      {
        key: 'TotPF',
        name: '总功率因数',
      },
      {
        key: 'TotPF',
        name: '总功率因数',
      },
    ],
  },
  {
    value: 'evt_reclose',
    label: '重合闸事件',
    sub: [
      {
        key: 'SupWh',
        name: '正向有功总电能',
      },
      {
        key: 'RtlWh',
        name: '反向有功总电能',
      },
      {
        key: 'Tmp',
        name: '端子温度',
      },
      {
        key: 'PhV_adc',
        name: '相电压(ADC)',
      },
      {
        key: 'PhA_adc',
        name: '相保护电流(ADC)',
      },
      {
        key: 'A_neut_adc',
        name: '零线电流',
      },
      {
        key: 'TotW',
        name: '总有功功率',
      },
      {
        key: 'TotVAr',
        name: '总无功功率',
      },
      {
        key: 'TotPF',
        name: '总功率因数',
      },
      {
        key: 'TotPF',
        name: '总功率因数',
      },
    ],
  },
  {
    value: 'evt_short_circuit',
    label: '相间短路事件',
    sub: [
      {
        key: 'SupWh',
        name: '正向有功总电能',
      },
      {
        key: 'RtlWh',
        name: '反向有功总电能',
      },
      {
        key: 'Tmp',
        name: '端子温度',
      },
      {
        key: 'PhV_adc',
        name: '相电压(ADC)',
      },
      {
        key: 'PhA_adc',
        name: '相保护电流(ADC)',
      },
      {
        key: 'A_neut_adc',
        name: '零线电流',
      },
      {
        key: 'TotW',
        name: '总有功功率',
      },
      {
        key: 'TotVAr',
        name: '总无功功率',
      },
      {
        key: 'TotPF',
        name: '总功率因数',
      },
      {
        key: 'TotPF',
        name: '总功率因数',
      },
    ],
  },
  {
    value: 'evt_leak',
    label: '微断漏电事件',
    sub: [
      {
        key: 'SupWh',
        name: '正向有功总电能',
      },
      {
        key: 'RtlWh',
        name: '反向有功总电能',
      },
      {
        key: 'Tmp',
        name: '端子温度',
      },
      {
        key: 'PhV_adc',
        name: '相电压(ADC)',
      },
      {
        key: 'PhA_adc',
        name: '相保护电流(ADC)',
      },
      {
        key: 'A_neut_adc',
        name: '零线电流',
      },
      {
        key: 'TotW',
        name: '总有功功率',
      },
      {
        key: 'TotVAr',
        name: '总无功功率',
      },
      {
        key: 'TotPF',
        name: '总功率因数',
      },
      {
        key: 'TotPF',
        name: '总功率因数',
      },
    ],
  },
  {
    value: 'evt_oc1',
    label: '微断过流Ⅰ段事件',
    sub: [
      {
        key: 'SupWh',
        name: '正向有功总电能',
      },
      {
        key: 'RtlWh',
        name: '反向有功总电能',
      },
      {
        key: 'Tmp',
        name: '端子温度',
      },
      {
        key: 'PhV_adc',
        name: '相电压(ADC)',
      },
      {
        key: 'PhA_adc',
        name: '相保护电流(ADC)',
      },
      {
        key: 'A_neut_adc',
        name: '零线电流',
      },
      {
        key: 'TotW',
        name: '总有功功率',
      },
      {
        key: 'TotVAr',
        name: '总无功功率',
      },
      {
        key: 'TotPF',
        name: '总功率因数',
      },
      {
        key: 'TotPF',
        name: '总功率因数',
      },
    ],
  },
  {
    value: 'ect_oc2',
    label: '微断过流Ⅱ段事件',
    sub: [
      {
        key: 'SupWh',
        name: '正向有功总电能',
      },
      {
        key: 'RtlWh',
        name: '反向有功总电能',
      },
      {
        key: 'Tmp',
        name: '端子温度',
      },
      {
        key: 'PhV_adc',
        name: '相电压(ADC)',
      },
      {
        key: 'PhA_adc',
        name: '相保护电流(ADC)',
      },
      {
        key: 'A_neut_adc',
        name: '零线电流',
      },
      {
        key: 'TotW',
        name: '总有功功率',
      },
      {
        key: 'TotVAr',
        name: '总无功功率',
      },
      {
        key: 'TotPF',
        name: '总功率因数',
      },
      {
        key: 'TotPF',
        name: '总功率因数',
      },
    ],
  },
  {
    value: 'evt_oz1',
    label: '零线过流Ⅰ段事件',
    sub: [
      {
        key: 'SupWh',
        name: '正向有功总电能',
      },
      {
        key: 'RtlWh',
        name: '反向有功总电能',
      },
      {
        key: 'Tmp',
        name: '端子温度',
      },
      {
        key: 'PhV_adc',
        name: '相电压(ADC)',
      },
      {
        key: 'PhA_adc',
        name: '相保护电流(ADC)',
      },
      {
        key: 'A_neut_adc',
        name: '零线电流',
      },
      {
        key: 'TotW',
        name: '总有功功率',
      },
      {
        key: 'TotVAr',
        name: '总无功功率',
      },
      {
        key: 'TotPF',
        name: '总功率因数',
      },
      {
        key: 'TotPF',
        name: '总功率因数',
      },
    ],
  },
  {
    value: 'evt_oz2',
    label: '零线过流Ⅱ段事件',
    sub: [
      {
        key: 'SupWh',
        name: '正向有功总电能',
      },
      {
        key: 'RtlWh',
        name: '反向有功总电能',
      },
      {
        key: 'Tmp',
        name: '端子温度',
      },
      {
        key: 'PhV_adc',
        name: '相电压(ADC)',
      },
      {
        key: 'PhA_adc',
        name: '相保护电流(ADC)',
      },
      {
        key: 'A_neut_adc',
        name: '零线电流',
      },
      {
        key: 'TotW',
        name: '总有功功率',
      },
      {
        key: 'TotVAr',
        name: '总无功功率',
      },
      {
        key: 'TotPF',
        name: '总功率因数',
      },
      {
        key: 'TotPF',
        name: '总功率因数',
      },
    ],
  },
  {
    value: 'evt_arc',
    label: '电弧故障事件',
    sub: [
      {
        key: 'SupWh',
        name: '正向有功总电能',
      },
      {
        key: 'RtlWh',
        name: '反向有功总电能',
      },
      {
        key: 'Tmp',
        name: '端子温度',
      },
      {
        key: 'PhV_adc',
        name: '相电压(ADC)',
      },
      {
        key: 'PhA_adc',
        name: '相保护电流(ADC)',
      },
      {
        key: 'A_neut_adc',
        name: '零线电流',
      },
      {
        key: 'TotW',
        name: '总有功功率',
      },
      {
        key: 'TotVAr',
        name: '总无功功率',
      },
      {
        key: 'TotPF',
        name: '总功率因数',
      },
      {
        key: 'TotPF',
        name: '总功率因数',
      },
    ],
  },
];
const p3p4Common = [
  {
    key: 'SupWh',
    name: '正向有功总电能',
  },
  {
    key: 'RtlWh',
    name: '反向有功总电能',
  },
  {
    key: 'Tmp_PhsA',
    name: 'A相端子温度',
  },
  {
    key: 'Tmp_PhsB',
    name: 'B相端子温度',
  },
  {
    key: 'Tmp_PhsC',
    name: 'C相端子温度',
  },
  {
    key: 'A_neut',
    name: '零线电流',
  },
  {
    key: 'TotW',
    name: '总有功功率',
  },
  {
    key: 'PhW_phsA',
    name: 'A相有功功率',
  },
  {
    key: 'PhW_phsB',
    name: 'B相有功功率',
  },
  {
    key: 'PhW_phsC',
    name: 'C相有功功率',
  },
  {
    key: 'TotVAr',
    name: '总无功功率',
  },
  {
    key: 'PhVAr_phsA',
    name: 'A相无功功率',
  },
  {
    key: 'PhVAr_phsB',
    name: 'B相无功功率',
  },
  {
    key: 'PhVAr_phsC',
    name: 'C相无功功率',
  },
  {
    key: 'TotPF',
    name: '总功率因数',
  },
  {
    key: 'PhPF_phsA',
    name: 'A相功率因数',
  },
  {
    key: 'PhPF_phsB',
    name: 'B相功率因数',
  },
  {
    key: 'PhPF_phsC',
    name: 'C相功率因数',
  },
  {
    key: 'PhPF_phsC',
    name: 'C相功率因数',
  },
  {
    key: 'op_code',
    name: '操作码',
  },
];
const p3p4Events = [
  {
    value: 'evt_close',
    label: '微断合闸事件',
    sub: p3p4Common,
  },
  { value: 'evt_open', label: '微断拉闸事件', sub: p3p4Common },
  { value: 'evt_lock', label: '微断闭锁事件', sub: p3p4Common },
  {
    value: 'evt_abnomal',
    label: '微断异常事件',
    sub: [
      {
        key: 'SupWh',
        name: '正向有功总电能',
      },
      {
        key: 'RtlWh',
        name: '反向有功总电能',
      },
      {
        key: 'ab_code',
        name: '异常码',
      },
    ],
  },
  {
    value: 'evt_upgrade',
    label: '软件升级事件',
    sub: [
      {
        key: 'SupWh',
        name: '正向有功总电能',
      },
      {
        key: 'RtlWh',
        name: '反向有功总电能',
      },
      {
        key: 'sv',
        name: '升级软件版本信息',
      },
      {
        key: 'op_code',
        name: '操作码',
      },
    ],
  },
  {
    value: 'evt_para_mod',
    label: '参数修改事件',
    sub: [
      {
        key: 'param_no',
        name: '修改的参数类型',
      },
      {
        key: 'op_code',
        name: '操作码',
      },
    ],
  },
  {
    value: 'evt_clr',
    label: '微断清零事件',
    sub: [
      {
        key: 'SupWh',
        name: '正向有功总电能',
      },
      {
        key: 'RtlWh',
        name: '反向有功总电能',
      },
      {
        key: 'op_code',
        name: '操作码',
      },
    ],
  },
  {
    value: 'evt_reboot',
    label: '设备重启事件',
    sub: [
      {
        key: 'SupWh',
        name: '正向有功总电能',
      },
      {
        key: 'RtlWh',
        name: '反向有功总电能',
      },
    ],
  },
  {
    value: 'evt_leak_test',
    label: '漏电自检事件',
    sub: [
      {
        key: 'SupWh',
        name: '正向有功总电能',
      },
      {
        key: 'RtlWh',
        name: '反向有功总电能',
      },
      {
        key: 'op_code',
        name: '操作码',
      },
    ],
  },
  { value: 'evt_pwroff', label: '微断停电事件', sub: p3p4Common },
  { value: 'evt_pwron', label: '微断上电事件', sub: p3p4Common },
  { value: 'evt_uv_phsA', label: 'A相欠压事件', sub: p3p4Common },
  { value: 'evt_uv_phsB', label: 'B相欠压事件', sub: p3p4Common },
  { value: 'evt_uv_phsC', label: 'C相欠压事件', sub: p3p4Common },
  { value: 'evt_ov_phsA', label: 'A相过压事件', sub: p3p4Common },
  { value: 'evt_ov_phsB', label: 'B相过压事件', sub: p3p4Common },
  { value: 'evt_ov_phsC', label: 'C相过压事件', sub: p3p4Common },
  { value: 'evt_lackV_phsA', label: 'A相断相事件', sub: p3p4Common },
  { value: 'evt_lackV_phsB', label: 'B相断相事件', sub: p3p4Common },
  { value: 'evt_lackV_phsC', label: 'C相断相事件', sub: p3p4Common },
  { value: 'evt_op_phsA', label: 'A相功率过载事件', sub: p3p4Common },
  { value: 'evt_op_phsB', label: 'B相功率过载事件', sub: p3p4Common },
  { value: 'evt_op_phsC', label: 'C相功率过载事件', sub: p3p4Common },
  { value: 'evt_ot_phsA', label: 'A相端子过热报警事件', sub: p3p4Common },
  { value: 'evt_ot_phsB', label: 'B相端子过热报警事件', sub: p3p4Common },
  { value: 'evt_ot_phsC', label: 'C相端子过热报警事件', sub: p3p4Common },
  { value: 'evt_reclose', label: '重合闸事件', sub: p3p4Common },
  { value: 'evt_short_circuit_phsA', label: 'A相短路过流事件', sub: p3p4Common },
  { value: 'evt_short_circuit_phsB', label: 'B相短路过流事件', sub: p3p4Common },
  { value: 'evt_short_circuit_phsC', label: 'C相短路过流事件', sub: p3p4Common },
  { value: 'evt_oc1_phsA', label: 'A相过流I段事件', sub: p3p4Common },
  { value: 'evt_oc1_phsB', label: 'B相过流I段事件', sub: p3p4Common },
  { value: 'evt_oc1_phsC', label: 'C相过流I段事件', sub: p3p4Common },
  { value: 'evt_oc2_phsA', label: 'A相过流II段事件', sub: p3p4Common },
  { value: 'evt_oc2_phsB', label: 'B相过流II段事件', sub: p3p4Common },
  { value: 'evt_oc2_phsC', label: 'C相过流II段事件', sub: p3p4Common },
  { value: 'evt_oz1', label: '零线过流I段事件', sub: p3p4Common },
  { value: 'evt_oz2', label: '零线过流II段事件', sub: p3p4Common },
  { value: 'evt_arc_phsA', label: 'A相电弧故障', sub: p3p4Common },
  { value: 'evt_arc_phsB', label: 'B相电弧故障', sub: p3p4Common },
  { value: 'evt_arc_phsC', label: 'C相电弧故障', sub: p3p4Common },
  { value: 'evt_seq_V', label: '电压逆相序事件', sub: p3p4Common },
  { value: 'evt_seq_A', label: '电流逆相序事件', sub: p3p4Common },
  { value: 'evt_imb_V', label: '电压不平衡事件', sub: p3p4Common },
  { value: 'evt_imb_A', label: '电流不平衡事件', sub: p3p4Common },
];
export const eventsOption = {
  '1p': p1p2Events,
  '2p': p1p2Events,
  '3p': p3p4Events,
  '4p': p3p4Events,
};
