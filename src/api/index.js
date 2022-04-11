/**
 * 包含应用中所有接口请求函数的模块
 * 每个函数的返回值都是promise
 * 基本要求: 能根据接口文档定义接口请求函数
 */

import ajax from './ajax'
import jsonp from 'jsonp'
import {message} from 'antd'

// const BASE = 'http://localhost:5000'
const BASE = '/api'  // 在package.json中配置了代理: "proxy": "http://localhost:5000"

// 1.请求登陆接口
// export function reqLogin(username, password) {
//   return ajax('/login', {username, password}, 'POST')
// }
export const reqLogin = (username, password)=>{
    return ajax(BASE+'/login', {username, password}, 'POST')
}

// 2.获取天气
export const reqWeather = ()=>{  // jsonp请求的接口请求函数
    return new Promise(((resolve, reject) => {
        // const url = `http://api.k780.com/?app=weather.today&weaId=1&appkey=10003&sign=b59bc3ef6191eb9f747dd4e83c99f2a4&format=json`  // 此接口不能使用jsonp
        const url = `https://tianqiapi.com/api?version=v1&appid=41741935&appsecret=1WCZkBa7`  // 实况天气接口

        // 发送jsonp请求
        jsonp(url, {}, (err, data)=>{
            // console.log('jsonp()', err, data)
            if(!err) {  // 如果成功了
                const city = data.city
                const { wea, tem } = data.data[0]
                // console.log(weather)
                resolve({city, weather:wea, temperature: tem})
            } else {  // 如果失败了
                message.error('获取天气信息失败!')
            }
        })
    }))
}


// 3.获取一级/二级分类的列表
export const reqCategoryList = (parentId)=>ajax(BASE + '/manage/category/list', {parentId}, 'GET')

// 4.添加分类
export const reqAddCategory = (parentId, categoryName)=>ajax(BASE + '/manage/category/add', {parentId, categoryName}, 'POST')

// 5.更新分类
export const reqUpdateCategory = ({categoryId, categoryName})=>ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST')

// 6.获取一个分类
export const reqCategory = (categoryId)=>ajax(BASE + '/manage/category/info', {categoryId}, 'GET')

// 7.获取商品分页列表
export const reqProductList = (pageNum, pageSize)=>ajax(BASE+'/manage/product/list', {pageNum, pageSize}, 'GET')

// 8.搜索商品分页列表 (根据商品名称/商品描述) => searchType: 搜索的类型, productName/productDesc
export const reqSearchProductList = ({pageNum, pageSize, searchType, searchName})=>ajax(BASE+'/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchName
}, 'GET')


// 9.对商品进行上架/下架处理
export const reqUpdateStatus = (productId, status)=>ajax(BASE+'/manage/product/updateStatus', {productId, status}, 'POST')

// 10.删除指定名称的图片
export const reqDeleteImg = (name)=>ajax(BASE+'/manage/img/delete', {name}, 'POST')

// 11.添加/修改商品
/*
export const reqAddProduct = (product)=>ajax(BASE+'/manage/product/add', product, 'POST')
export const reqUpdateProduct = (product)=>ajax(BASE+'/manage/product/update', product, 'POST')
*/
export const reqAddUpdateProduct = (product)=>ajax(BASE+'/manage/product/'+(product._id ? 'update' : 'add'), product, 'POST')


// 12.获取所有角色的列表
export const reqRoleList = ()=>ajax(BASE+'/manage/role/list', {}, 'GET')

// 13.添加角色
export const reqAddRole = (roleName)=>ajax(BASE+'/manage/role/add', {roleName}, 'POST')

// 14.更新角色(给角色设置权限)
export const reqUpdateRole = (role)=>ajax(BASE+'/manage/role/update', role, 'POST')


// 15.获取所有用户的列表
export const reqUserList = ()=>ajax(BASE+'/manage/user/list', {}, 'GET')

// 16.删除指定用户
export const reqDeleteUser = (userId)=>ajax(BASE+'/manage/user/delete', {userId}, 'POST')

// 17.添加/更新用户
// export const reqAddUser = user=>ajax(BASE+'/manage/user/add', user, 'POST')
export const reqAddOrUpdateUser= (user)=>ajax(BASE+'/manage/user/'+(user._id ? 'update' : 'add'), user, 'POST')
// 订单
export const getOrder = (pageNum, pageSize)=>ajax(BASE+'/order/list', {pageNum, pageSize}, 'GET')
// 按照ID进行搜索
export const getSearchOrder = ({pageNum, pageSize, searchName})=>ajax(BASE+'/order/list/search', {
    pageNum,
    pageSize,
    searchName
}, 'GET')





// reqWeather()

/*
jsonp解决ajax跨域的原理
  1). jsonp只能解决GET类型的ajax请求跨域问题
  2). jsonp请求不是ajax请求, 而是一般的get请求
  3). 基本原理
   浏览器端:
      动态生成<script>来请求后台接口(src就是接口的url)
      定义好用于接收响应数据的函数(fn), 并将函数名通过请求参数提交给后台(如: callback=fn)
   服务器端:
      接收到请求处理产生结果数据后, 返回一个函数调用的js代码, 并将结果数据作为实参传入函数调用
   浏览器端:
      收到响应自动执行函数调用的js代码, 也就执行了提前定义好的回调函数, 并得到了需要的结果数据
 */
