// eslint-disable-next-line import/prefer-default-export
export const showList = [
  {
    name: '端子温度',
    child: [
      { param: 'Tmp_PhsA', name: 'A相端子温度' },
      { param: 'Tmp_PhsB', name: 'B相端子温度' },
      { param: 'Tmp_PhsC', name: 'C相端子温度' },
    ],
  },
  {
    name: '有功功率',
    child: [
      { param: 'PhW_phsA', name: 'A相有功功率' },
      { param: 'PhW_phsB', name: 'B相有功功率' },
      { param: 'PhW_phsC', name: 'C相有功功率' },
    ],
  },
  {
    name: '相电压(ADC)',
    child: [
      { param: 'V_phsA', name: 'A相电压' },
      { param: 'V_phsB', name: 'B相电压' },
      { param: 'V_phsC', name: 'C相电压' },
    ],
  },
  {
    param: 'TotVAr',
    name: '总无功功率',
  },
  {
    name: '相测量电流',
    child: [
      { param: 'A_phsA', name: 'A相电流' },
      { param: 'A_phsB', name: 'B相电流' },
      { param: 'A_phsC', name: 'C相电流' },
    ],
  },
  {
    name: '无功功率',
    child: [
      { param: 'PhVAr_phsA', name: 'A相有功功率' },
      { param: 'PhVAr_phsB', name: 'B相有功功率' },
      { param: 'PhVAr_phsC', name: 'C相有功功率' },
    ],
  },
  {
    param: 'Vdc2',
    name: '直流2电源电压',
  },
  {
    param: 'TotVA',
    name: '总视在功率',
  },
  {
    param: 'A_neut',
    name: '零线电流',
  },
  {
    name: '视在功率',
    child: [
      { param: 'PhVA_phsA', name: 'A相视在功率' },
      { param: 'PhVA_phsB', name: 'B相视在功率' },
      { param: 'PhVA_phsC', name: 'C相视在功率' },
    ],
  },
  {
    param: 'Hz',
    name: '电网频率',
  },
  {
    param: 'TotPF',
    name: '总功率因数',
  },
  {
    param: 'TotW',
    name: '总有功功率',
  },
  {
    name: '功率因数',
    child: [
      { param: 'PhPF_phsA', name: 'A相功率因数' },
      { param: 'PhPF_phsB', name: 'B相功率因数' },
      { param: 'PhPF_phsC', name: 'C相功率因数' },
    ],
  },
];
