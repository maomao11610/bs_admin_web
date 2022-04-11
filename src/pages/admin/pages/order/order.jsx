/*
 * @Author: your name
 * @Date: 2022-04-09 15:12:39
 * @LastEditTime: 2022-04-11 16:10:37
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \admin-client\src\pages\admin\pages\order\order.jsx
 */
/**
 * 订单管理
 */

/**
 * 订单列表管理路由
 */
 import React, {Component} from 'react'
import { getOrder,getSearchOrder } from '../../../../api';
import { Card, Table, Input,Divider,Button } from 'antd'
import {formatDate} from '../../../../utils/dateUtils'
import {transmission} from '../../../../utils/biansu.js'

import './order.less'
 export default class Order extends Component {
   state={
     data:[],
     searchName: '', // 搜索的关键字
     total: 0,
   }
  renderImg=(src)=>{
    return <img src={src}></img>

  }
initColumns=()=>{
  this.columns = [
    {
      title: '订单号',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: '车系',
      dataIndex: 'series',
      key: 'series',
    },
    {
      title: '卖家',
      dataIndex: 'sellerName',
      key: 'sellerName',
    },
    {
      title: '颜色',
      dataIndex: 'color',
      key: 'color',
    },
    {
      title: '排量',
      dataIndex: 'displacement',
      key: 'displacement',
    },
    {
      title: '变速箱',
      dataIndex: 'transmissionCase',
      key: 'transmissionCase',
      render:transmission,
    },
    {
      title: '封面',
      dataIndex: 'pic',
      key: 'pic',
      render:this.renderImg
    },
    {
      title: '里程',
      dataIndex: 'mileage',
      key: 'mileage',
    },
    {
      title: '下单时间',
      dataIndex: 'orderTime',
      key: 'orderTime',
      render: formatDate
    },
    {
      title: '挂牌时间',
      dataIndex: 'listingTime',
      key: 'listingTime',
      render: formatDate
    },

    
  ];
}
    // 获取指定页码的列表数据显示
    getOrderList = async (pageNum, pageSize)=>{
      this.pageNum = pageNum
      this.pageSize = pageSize
      const {searchName} = this.state
      let result
      if(searchName) {  // 如果搜索关键字有值, 说明我们要做搜索分页
          result = await getSearchOrder({pageNum, pageSize,  searchName })
      } else{  // 一般分页请求
          result = await getOrder(pageNum, pageSize)
      }

      if(result.status === 0) {
        const {total,list}=result.data
          this.setState({
             data:list,
             total:total
          })
      }
  }
UNSAFE_componentWillMount() {
  this.initColumns()
}
componentDidMount() {
  this.getOrderList(1,5)
}
     render() {
      const { data, total, searchName } = this.state
   
            return (
           <Card>
               <Input placeholder='请输入订单编号进行搜索' style={{width:150, margin:'0 15px'}} value={searchName}
                       onChange={event => this.setState({searchName:event.target.value})}/>
                <Button type="primary" onClick={()=>this.getOrderList(1,5)}>搜索</Button>
              <Divider />
              <Table rowKey='_id' bordered dataSource={data} columns={this.columns} 
                       pagination={{
                           defaultPageSize: 5, defaultCurrent: 1,
                           total: total, current: this.pageNum, pageSize: this.pageSize,
                           showSizeChanger:true, pageSizeOptions: ['5','10','20','40'],
                           showQuickJumper: true,
                           onShowSizeChange: this.getOrderList,
                           onChange: this.getOrderList
                       }}
                >
                </Table>
           </Card>
       )
   }

 }
 