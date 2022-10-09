import axios from 'axios';
import Message from 'ant-design-vue/lib/message';
import { REQ_TIME_OUT } from 'configPath/index';
import { paramsSerializer, isTokenExpired } from 'commonPath/utils';

import {
  ajaxFulFilledHandle,
  ajaxRejectedHandle
} from './ajaxErrorHandle';

let axiosInstance;

// 创建axiso实例
export function createAxiosInstance(config) {
  axiosInstance = axios.create(config);
  const reqInterceptors = [];

  // 判断token是否过期
  function authValid() {
    const auth = JSON.parse(localStorage.getItem('auth') || '{}');
    const { token, expired } = auth;
    const { href, hash } = window.location;
    // console.log(`Expired: ${isTokenExpired()}`);
    if (token && hash !== '#/login') {
      if (isTokenExpired()) {
        Message.info('token过期，请重新登录');
         localStorage.removeItem('auth');
        window.location = href.replace(hash, '#/login');
      }
    }
  }

const rspInterceptors = [{
  // 错误处理
  fulfilled: rsp => ajaxFulFilledHandle(rsp.data, { type: 'ajax', options: { rsp } }),
  rejected: ajaxRejectedHandle
}];


  function addInterceports(interceptors = [], type = 'request') {
    if (type === 'request') {
      authValid();
    }

    interceptors.forEach(interceptor => axiosInstance.interceptors[type]
      .use(interceptor.fulfilled, interceptor.rejected));
}

addInterceports(reqInterceptors, 'request');
addInterceports(rspInterceptors, 'response');
  return axiosInstance;
}


export default createAxiosInstance;
