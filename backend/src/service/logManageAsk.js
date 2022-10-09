import { HTTP_METHOD } from 'configPath/index';
import { reqHandle } from 'commonPath/ajax';

export default {
  getLogList: reqHandle('/loginlog/get', {
    method: HTTP_METHOD.POST,
  }),
  getAppLogList: reqHandle('/loginlog/getapp', {
    method: HTTP_METHOD.POST,
  }),
  getControlLog: reqHandle('/device/getcontrollog', {
  method: HTTP_METHOD.POST,
  }),
  getSystemLog: reqHandle('/systemlog/get', {
    method: HTTP_METHOD.POST,
  }),
  getAssignmentLog: reqHandle('/assignment/getassignmentlog', {
    method: HTTP_METHOD.POST,
  }),
  getTimingLog: reqHandle('/tasklog/getlog', {
    method: HTTP_METHOD.POST,
  }),
};
