/**
 * 入口js文件
 */
import React from 'react'
import ReactDOM from 'react-dom'
// import 'antd/dist/antd.css'  // 会导入antd的所有样式,没有起到按需导入

import App from './App'
import storageUtils from './utils/storageUtils'
import memoryUtils from './utils/memoryUtils'

// 读取local中保存user, 保存到内存中
const user = storageUtils.getUser()
memoryUtils.user = user

// 将App组件标签渲染到index页面的div上
ReactDOM.render(<App />, document.getElementById('root'));

