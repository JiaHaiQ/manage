import axios from "axios";
import { Message } from "element-ui";

//创建axios，赋给变量
const BASEURL = process.env.NODE_ENV === "production" ? "" : "/devApi";
const service = axios.create({
  baseURL: BASEURL,
  timeout: 15000 //超时
});

// 添加请求拦截器
service.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

/**
 * 请求接口后，返回数据进行拦截（响应拦截器）
 */
service.interceptors.response.use(
  function(response) {
    // 对响应数据做些什么
    let data = response.data;
    if (data.resCode !== 0) {
      Message.error(data.message);
      return Promise.reject(data);
    } else {
      return response;
      // return Promise.resolve;
    }
  },
  function(error) {
    // 对响应错误做些什么
    return Promise.reject(error);
  }
);

export default service;

/**
 * 使用export default时，不能同时存在多个default，
 * 文件import引入时不需要花括号
 */
