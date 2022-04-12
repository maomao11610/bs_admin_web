/*
 * @Author: your name
 * @Date: 2022-04-12 19:59:36
 * @LastEditTime: 2022-04-12 20:58:52
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \admin-client\src\pages\admin\pages\order\content\content.jsx
 */
import React, { Component } from 'react'
import { Tag } from 'antd';
import {formatDate} from '../../../../../utils/dateUtils'
import './content.less'
export default class Content extends Component {
    renderImg=(src)=>{
        return(<img src={src}></img>)
    }
showRepair=(n)=>{
    //处理是否维修渲染逻辑
if(n===0){
    // ‘无检修痕迹’
    return(<Tag color="lime">否</Tag>)
}else{
    return(<Tag color="red">是</Tag>)
}
}
    render() {
        // 已经拿到数据了，完成渲染
        const { detail } = this.props;
        const listingTime=formatDate(detail.listingTime)
        return (
            <div style={{ padding: '30px' }}>
            <ul className='list'>
                <li>内容编号：{detail.saleId}</li>
                <li>卖家姓名: {detail.sallerName}</li>
                <li>卖家身份证号： {detail.sallerId}</li>
                <li className='pic'>身份证原件： {this.renderImg(detail.cardPic)}</li>
                <li className='pic'>封面： {this.renderImg(detail.carPic)}</li>
                <li>里程 :{detail.mileage}KM</li>
                <li>挂牌日期： {listingTime}</li>
                <li>是否维修 : {this.showRepair(detail.repair)} </li>
                <li className='pic'>审核原件:{this.renderImg(detail.reviewPic)}</li>
                <li>复核员工号: {detail.reviewerNumber}</li>
            </ul>
            </div>)
    }
}