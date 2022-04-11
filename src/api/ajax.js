/**
 * 能发送异步ajax请求的函数模块
     封装axios库
     函数的返回值是promise对象

   axios.get()/post()返回的就是 promise 对象
   1.优化1: 统一处理请求异常?
     在外层包一个自己创建的promise对象
     在请求出错时, 不reject(error), 而是显示错误提示
   2.优化2: 异步得到不是response, 而是response.data
     在请求成功resolve时: resolve(response.data)
 */

import axios from 'axios'
import { message } from 'antd'

export default function ajax(url, data={}, type='GET') {
    /*
    if(type.toUpperCase() === 'GET') { // 发GET请求
         return axios.get(url, { // 配置对象
            params: data  // params配置指定的是query参数
        })
    } else if(type.toUpperCase() === 'POST') { // 发POST请求
        return axios.post(url, data)
    }
    */


    // 优化后
    return new Promise((resolve, reject)=>{
        let promise

        // 1. 执行异步ajax请求
        if(type.toUpperCase() === 'GET') { // 发GET请求
            promise = axios.get(url, { // 配置对象
                params: data  // params 配置指定的是 query 参数
            })
        } else if(type.toUpperCase() === 'POST') { // 发POST请求
            promise = axios.post(url, data)
        }

        // 2. 如果成功了, 调用resolve(value)
        promise.then(response=>{
            resolve(response.data)

        // 3. 如果失败了, 不调用reject(reason), 而是提示异常信息
        }).catch(error=>{  // 对所有 ajax 请求出错做统一处理, 外层就不用再处理错误了
            // reject(error)
            message.error('请求出错了: ' + error.message)
        })
    })
}





