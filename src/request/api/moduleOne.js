/**
* moduleOne模块接口列表
* base中定义了接口的baseUrl
* */
import base from '@/request/api/base.js';
import request from '@/request/request.js';

const moduleOne = {
  testMethod: (data) => request(`${base.sq}/topics`, data, 'get')
}

export default moduleOne
