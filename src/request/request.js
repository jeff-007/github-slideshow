
import instance from '../request/interceptor.js'
import QS from 'qs'
import { Message, Loading, MessageBox } from 'element-ui'


/**
 * 核心函数，可通过它处理一切请求数据，并做横向扩展
 * @param {url} 请求地址
 * @param {params} 请求参数
 * @param {options} 请求配置，针对当前本次请求；
 * @param loading 是否显示loading
 * @param mock 本次是否请求mock而非线上
 * @param error 本次是否显示错误
 */
function request(url = '', params = {}, options = { loading: true, mock: false, error: true }, method = 'post') {
  //  此处对登录权限过期的情况进行处理
  const isNeedLogin = false
  const isExpired = false
  if (isNeedLogin && isExpired) {
    return new Promise((resolve, reject) => {
      MessageBox.alert('您当前的登录权限已过期，请稍后重试', '提示', {
        confirmButtonText: '确定',
        callback: action => {
          location.href = ''
        }
      })
    })
  }

  return new Promise((resolve, reject) => {
    // 此处对传入的url作处理
    const newUrl = '';

    // 请求前loading
    let loadingInstance;
    if (options.loading) {
      loadingInstance = Loading.service();
    }
    let data = {}
    // get请求使用params字段
    if (method === 'get') data = { params }
    // post请求使用data字段
    if (method === 'post') data = { data: params }
    instance({
      url,
      method,
      transformRequest: [function(data, headers) {
        // 对 data 进行任意转换处理
        return QS.stringify(data)
      }],
      ...data
    }).then((res) => {
      // 此处作用很大，可以扩展很多功能。
      // 比如对接多个后台，数据结构不一致，可做接口适配器
      // 也可对返回日期/金额/数字等统一做集中处理
      if (res.data.error_code == 0) {
        resolve(res.data);
      } else {
        // 通过配置可关闭错误提示
        if (options.error)Message.error(res.data.msg);
        reject(res);
      }
    }).catch((error) => {
      Message.error(error.message)
    }).finally(() => {
      loadingInstance.close();
    })
  })
}
// // 封装GET请求
// function get(url, params, options) {
//   return request(url, params, options, 'get')
// }
// // 封装POST请求
// function post(url, params, options) {
//   return request(url, params, options, 'post')
// }

export default request;


