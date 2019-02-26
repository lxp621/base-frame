/**
 * 后台访问接口
 * @author lixiaopan
 * @date 2018/5/25
 */
'use strict'
import qs from 'qs'
import axios from 'axios'
// 接口根地址
/* eslint-disable no-undef */
var baseUrl = baseApiUrl
// axios 配置
axios.defaults.timeout = 100000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// 执行 POST 请求
function post (opt) {
  return http('post', opt)
}

// 执行 GET 请求
function get (opt) {
  return http('get', opt)
}

// 执行无JSON格式的 GET 请求
function getData (opt) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: baseApiUrl + opt.url,
      params: opt.params
    }).then(
      res => {
        resolve(res.data)
      }
    )
  })
}

function http (method, opt) {
  return new Promise((resolve, reject) => {
    let config = {
      method: method,
      url: baseUrl + opt.url
    }
    if (method === 'get') {
      config = Object.assign({params: opt.params}, config)
    } else {
      let headOpt = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
      config = Object.assign({data: qs.stringify(opt.params) || {}, headers: headOpt}, config)
    }
    axios(config)
      .then(res => {
        // console.log(opt.ctx)
        resolve(res.data)
        /* if (res.data.errorCode === 0) { // 请求成功
          resolve(res.data)
        } else { // 请求服务端错误
          console.log(opt.ctx)
          console.error('请求失败！', res)
          reject(new Error('请求异常'), res.data)
        } */
      }, err => {
        console.log(opt.ctx)
        errorhandle(err, reject, opt.error)
      })
      .catch((err) => {
        console.log(opt.ctx)
        errorhandle(err, reject, opt.error)
      })
  })
}

function upload (opt) {
  return new Promise((resolve, reject) => {
    let config = {
      method: 'POST',
      url: baseUrl + opt.url
    }
    config = Object.assign({data: opt.params || {}, headers: {'Content-Type': 'multipart/form-data'}}, config)
    axios(config).then(res => {
      resolve(res.data)
    }, err => {
      console.log(opt.ctx)
      errorhandle(err, reject, opt.error)
    }).catch((err) => {
      console.log(opt.ctx)
      errorhandle(err, reject, opt.error)
    })
  })
}

function errorhandle (err, reject) {
  console.error('请求失败！', err)
  reject(err)
}

export default {
  post,
  get,
  getData,
  upload
}
