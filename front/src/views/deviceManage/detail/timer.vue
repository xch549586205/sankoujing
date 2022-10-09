<template>
  <div>
    <a-modal v-model="showModal.show" :visible="true" :footer="null" title="添加定时">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }" label="执行时间">
          <a-time-picker
            v-decorator="[
              'time',
              {
                rules: [{ required: true, message: '请选择执行时间' }],
                initialValue: formData.time,
              },
            ]"
            format="HH:mm"
          />
        </a-form-item>
        <a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }" label="执行周期">
          <a-checkbox-group
            v-decorator="[
              'weekday',
              {
                rules: [{ required: !hideWeekday, message: '请选择执行周期' }],
                initialValue: formData.weekday,
              },
            ]"
            :disabled="hideWeekday"
            :options="weekdayOptionsChinese"
          />
        </a-form-item>
        <a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }" label="执行任务">
          <a-radio-group
            v-decorator="[
              'task_action',
              {
                rules: [{ required: true, message: '请选择执行任务' }],
                initialValue: formData.task_action,
              },
            ]"
          >
            <a-radio value="close"> 合闸 </a-radio>
            <a-radio value="open"> 拉闸 </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 12 }">
          <a-button
            :disabled="showModal.type !== 'edit'"
            style="margin-right: 10px"
            type="danger"
            @click="delTimer()"
          >
            删除
          </a-button>
          <a-button
            @click="
              () => {
                showModal = { show: false, type: 'add' };
              }
            "
          >
            取消
          </a-button>

          <a-button type="primary" html-type="submit" style="margin-left: 10px" @click="handleOk">
            保存
          </a-button>
        </a-form-item>
      </a-form>
    </a-modal>
    <div class="timer">
      <div class="title">
        <a-button
          type="primary"
          @click="
            () => {
              showModal = { show: true, type: 'add' };
            }
          "
        >
          {{ showModal.type === 'add' ? '添加定时' : '编辑定时' }}
        </a-button>
      </div>
    </div>
    <a-table
      :columns="columns"
      :row-key="(record) => `${record.status}`"
      :data-source="timerList"
      :loading="loading"
      class="reset-pagination"
    >
      <template slot="switch" slot-scope="text, record">
        <a-switch
          :checked="record.enable === 'yes'"
          :loading="record.loading"
          @change="onChangeEnable(record, record.enable === 'yes' ? 'no' : 'yes')"
        />
      </template>
      <template slot="operation" slot-scope="text, record">
        <a @click="edit(record)"> 编辑 </a>
      </template>
    </a-table>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import service from 'servicePath/index';
const { deviceManageAsk, dataDisplayAsk } = service;
import moment from 'moment';

export default {
  name: 'ControlLog',
  components: {},
  mixins: [],
  props: {},
  data() {
    return {
      loading: false,
      showModal: { show: false, type: 'add' },
      weekdayOptions: ['0', '1', '2', '3', '4', '5', '6'],
      weekdayOptionsChinese: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      form: this.$form.createForm(this, { ...this.formData }),
      formData: {
        time: moment(moment().format('HH:mm'), 'HH:mm'),
        // actionType: 1,
        weekday: ['1', '2', '3', '4'],
        task_action: 'close',
      },
      timerList: [],
      columns: [
        {
          title: '执行时间',
          dataIndex: 'time',
          align: 'center',
        },
        {
          title: '类型',
          dataIndex: 'type',
          align: 'center',
        },
        {
          title: '执行周期',
          dataIndex: 'weekdayInfo',
          align: 'center',
        },

        {
          title: '执行任务',
          dataIndex: 'task_action',
          align: 'center',
        },

        {
          title: '使能开关',
          dataIndex: 'enable',
          align: 'center',
          scopedSlots: { customRender: 'switch' },
        },

        {
          title: '操作',
          dataIndex: 'status',
          align: 'left',
          scopedSlots: { customRender: 'operation' },
        },
      ],
    };
  },
  computed: {
    ...mapState('productManage', ['devicetypeList']),
    ...mapState('deviceManage', ['currentWatchDeviceInfo']),
    ...mapState('app', ['running', 'projectInfo']),
    hideWeekday() {
      return this.formData.actionType === 1;
    },
  },
  watch: {},
  created() {
    this.getTimer();
  },
  mounted() {},
  destroyed() {},
  methods: {
    async delTimer() {
      const { index } = JSON.parse(this.showModal.timer.value);
      await this.deleteTimer(index);
      this.getTimer();
      this.showModal = { show: false, type: 'add' };
    },
    edit(record) {
      const arr = record.weekday ? record.weekday.split('') : [];
      this.formData = {
        time: moment(record.time, 'HH:mm'),
        weekday: this.weekdayOptionsChinese.filter((c, i) => {
          return arr.indexOf(i + '') !== -1;
        }),
        task_action: record.task_action === '微断合位' ? 'close' : 'open',
      };
      this.form = this.$form.createForm(this, { ...this.formData });
      this.showModal = { show: true, type: 'edit', timer: record };
    },
    changType(type) {
      this.formData.actionType = type.target.value;
    },
    handleCancel() {},
    handleOk() {},
    async onChangeEnable(timer, enable) {
      let idx = '';
      this.timerList.map((t, i) => {
        if (t.index === timer.index) {
          idx = i;
        }
      });
      this.timerList = this.timerList.map((_timer, i) => ({
        ..._timer,
        loading: idx === i,
      }));
      await this.editTimer({ ...timer, enable });
      this.timerList = this.timerList.map((_timer, i) => ({
        ..._timer,
        loading: false,
      }));
      this.getTimer();
    },
    onChangeDate() {},
    async getTimer() {
      this.loading = true;
      const timerParams = {
        action: 'get',
        datatype: 'service',
        devtype: 'gw',
        gateway: JSON.parse(this.currentWatchDeviceInfo.privatedata).gatewayId,
        uuid: this.currentWatchDeviceInfo.did,
        msgtype: 'timedtask',
        token: Math.ceil(Math.random() * 100),
      };
      const { errcode, errmsg } = await deviceManageAsk.devControl({
        devctrs: [
          {
            did: this.currentWatchDeviceInfo.id,
            data: { action: JSON.stringify(timerParams) },
          },
        ],
      });
      if (errcode === 200 && errmsg === 'Success') {
        setTimeout(this.getTimerFromReportLog, 1000);
      } else {
        this.loading = false;
      }
    },
    async deleteTimer(index) {
      const timerParams = {
        action: 'delete',
        datatype: 'service',
        msgtype: 'timedtask',
        devtype: 'gw',
        uuid: this.currentWatchDeviceInfo.did,
        index,
      };
      deviceManageAsk.devControl({
        devctrs: [
          {
            did: this.currentWatchDeviceInfo.id,
            data: { action: JSON.stringify(timerParams) },
          },
        ],
      });
    },
    getWeekdayChinese(week) {
      const weekArr = week.split('');
      const chinese = [];
      weekArr.map((num) => {
        this.weekdayOptions.map((_week, i) => {
          if (num === _week) {
            chinese.push(this.weekdayOptionsChinese[i]);
          }
        });
      });
      return chinese.join(',');
    },
    async getTimerFromReportLog() {
      const { errcode, data = {} } = await dataDisplayAsk.getReportLog({
        order: 'createtime',
        limit: 160,
        offset: 1,
        value: '%timedtask%',
        uuid: this.currentWatchDeviceInfo.did,
        // key: 'timedtask',
        seq: 1,
      });
      this.loading = false;

      const timerList = data.alist.map((timer) => ({
        ...timer,
        ...JSON.parse(timer.value),
      }));
      const filterTimerList = [];
      timerList.map((timer) => {
        if (!filterTimerList.filter((_timer) => _timer.index === timer.index).length) {
          filterTimerList.push(timer);
        }
      });
      this.timerList = filterTimerList.map((timer) => {
        return {
          ...timer,
          type: timer.weekday ? '周期定时' : '单次定时',
          time: timer.weekday ? timer.time : moment(timer.time).format('HH:mm'),
          weekdayInfo: timer.weekday
            ? this.getWeekdayChinese(timer.weekday)
            : moment(timer.time).format('YYYY-MM-DD'),
          task_action: timer.task_action === 'close' ? '微断合位' : '微断分位',
          loading: false,
        };
      });
    },
    async addTimer(params) {
      const weekdayNum = params.weekday.map((week, i) => this.weekdayOptionsChinese.indexOf(week));
      const timerParams = {
        action: 'add',
        datatype: 'service',
        devtype: 'gw',
        gateway: JSON.parse(this.currentWatchDeviceInfo.privatedata).gatewayId,
        uuid: this.currentWatchDeviceInfo.did,
        token: Math.ceil(Math.random() * 100),
        msgtype: 'timedtask',
        enable: 'yes', //是否启用
        task_action: params.task_action,
        time: params.weekday.length
          ? params.time.format('HH:mm:ss')
          : params.time.format('YYYY-MM-DD HH:mm:ss'),
      };
      if (weekdayNum.length) {
        timerParams.weekday = weekdayNum.join('');
      }
      await deviceManageAsk.devControl({
        devctrs: [
          {
            did: this.currentWatchDeviceInfo.id,
            data: { action: JSON.stringify(timerParams) },
          },
        ],
      });
      this.showModal = { show: false };
      this.getTimer();
    },
    async editTimer(params) {
      const timerParams = {
        action: 'add',
        datatype: 'service',
        devtype: 'gw',
        gateway: JSON.parse(this.currentWatchDeviceInfo.privatedata).gatewayId,
        uuid: this.currentWatchDeviceInfo.did,
        token: params.token,
        msgtype: 'timedtask',
        enable: params.enable, //是否启用
        task_action: JSON.parse(params.value).task_action,
        weekday: JSON.parse(params.value).weekday,
        time: JSON.parse(params.value).time,
        index: JSON.parse(params.value).index,
      };
      deviceManageAsk.devControl({
        devctrs: [
          {
            did: this.currentWatchDeviceInfo.id,
            data: { action: JSON.stringify(timerParams) },
          },
        ],
      });
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.addTimer(values);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.title {
  margin-bottom: 10px;
}
</style>
