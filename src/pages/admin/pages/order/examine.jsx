/*
 * @Author: your name
 * @Date: 2022-04-11 20:14:26
 * @LastEditTime: 2022-04-11 20:59:34
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \admin-client\src\pages\admin\pages\order\exmaine.jsx
 */
// 卖家发布的内容列表
import React, {Component} from 'react'

import {getExamineList} from '../../../../api'
import './examine.less'
export default class Exmaine extends Component{
    state={
        data:[],
    }
    getList=async()=>{
        console.log('点击')
     await getExamineList();
    }
      render(){
          return(
              <div>
                  <span>内容列表</span>
                  <button onClick={this.getList}>点击</button>
                  
              </div>
          )
      }
}
