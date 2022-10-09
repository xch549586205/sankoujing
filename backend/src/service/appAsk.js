import { HTTP_METHOD } from 'configPath/index';
import { reqHandle } from 'commonPath/ajax';

export default {
  // 登录
  loginAccount: reqHandle('/account/login', {
    method: HTTP_METHOD.POST,
  }),
  // 注销
  logoutAccount: reqHandle('/account/logout', {
    method: HTTP_METHOD.POST,
  }),
  // 修改
  modAccount: reqHandle('/account/mod', {
    method: HTTP_METHOD.POST,
  }),
  // 删除
  delAccount: reqHandle('/account/del', {
    method: HTTP_METHOD.POST,
  }),
  // 添加黑白IP名单
  addIptable: reqHandle('/iptable/add', {
    method: HTTP_METHOD.POST,
  }),
  // 删除黑白IP名单
  delIptable: reqHandle('/iptable/del', {
    method: HTTP_METHOD.POST,
  }),
  // 查询黑白IP名单
  getIptable: reqHandle('/iptable/get', {
    method: HTTP_METHOD.POST,
  }),
  // 修改黑白IP名单
  modIptable: reqHandle('/iptable/mod', {
    method: HTTP_METHOD.POST,
  }),
  // 上传文件
  uploadFiles: reqHandle('/fileupload/h5zip', {
    method: HTTP_METHOD.POST,
  }),
  // 删除文件
  delFiles: reqHandle('/iptable/del', {
    method: HTTP_METHOD.POST,
  }),
  // 上传图片
  uploadPic: reqHandle('/fileupload/pic', {
    method: HTTP_METHOD.POST,
  }),
  // 上传配置文件
  uploadConfig: reqHandle('/fileupload/pconf', {
    method: HTTP_METHOD.POST,
  }),
  // 上传数据库恢复
  uploadRestore: reqHandle('/project/restore', {
    method: HTTP_METHOD.POST,
  }),
  // 上传WebH5
  uploadWebH5: reqHandle('/fileupload/webh5zip', {
    method: HTTP_METHOD.POST,
  }),
  // 上传Apk
  uploadApk: reqHandle('/fileupload/appapk', {
    method: HTTP_METHOD.POST,
  }),
  uploadBusiness: reqHandle('/fileupload/businessweb', {
    method: HTTP_METHOD.POST,
  }),
};
