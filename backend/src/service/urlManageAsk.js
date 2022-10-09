import { HTTP_METHOD } from 'configPath/index';
import { reqHandle } from 'commonPath/ajax';

export default {
    // 添加
    addUrlsite: reqHandle('/urlsite/add', {
      method: HTTP_METHOD.POST,
    }),
    // 删除
   delUrlsite: reqHandle('/urlsite/del', {
    method: HTTP_METHOD.POST,
    }),
    // 修改
    modUrlsite: reqHandle('/urlsite/mod', {
      method: HTTP_METHOD.POST,
    }),
    // 查询
    getUrlsite: reqHandle('/urlsite/get', {
      method: HTTP_METHOD.POST,
    }),
};
