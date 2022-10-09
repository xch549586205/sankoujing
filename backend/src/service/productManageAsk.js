import { HTTP_METHOD } from 'configPath/index';

import { reqHandle } from 'commonPath/ajax';

export default {
  /* 产品 */
  // 查询详情
  getDetailProduct: reqHandle('/product/getdetail', {
    method: HTTP_METHOD.POST,
  }),
  // 添加
  addProduct: reqHandle('/product/add', {
    method: HTTP_METHOD.POST,
  }),
  // 删除
  delProduct: reqHandle('/product/del', {
    method: HTTP_METHOD.POST,
  }),
  // 修改
  modProduct: reqHandle('/product/mod', {
    method: HTTP_METHOD.POST,
  }),
  // 查询
  getProduct: reqHandle('/product/get', {
    method: HTTP_METHOD.POST,
  }),

  /* 产品类型 */
  // 添加
  addCategory: reqHandle('/category/add', {
    method: HTTP_METHOD.POST,
  }),
  // 删除
  delCategory: reqHandle('/category/del', {
    method: HTTP_METHOD.POST,
  }),
  // 修改
  modCategory: reqHandle('/category/mod', {
    method: HTTP_METHOD.POST,
  }),
  // 查询
  getCategory: reqHandle('/category/get', {
    method: HTTP_METHOD.POST,
  }),

  /* 产品功能 */
  // 添加
  addAttribute: reqHandle('/product/addAttribute', {
    method: HTTP_METHOD.POST,
  }),
  // 删除
  delAttribute: reqHandle('/product/delAttribute', {
    method: HTTP_METHOD.POST,
  }),
  // 修改
  modAttribute: reqHandle('/product/modAttribute', {
    method: HTTP_METHOD.POST,
  }),
  // 查询
  getAttribute: reqHandle('/product/getAttribute', {
    method: HTTP_METHOD.POST,
  }),
};
