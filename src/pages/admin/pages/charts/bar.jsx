/*
 * @Author: your name
 * @Date: 2022-04-09 15:12:39
 * @LastEditTime: 2022-04-14 15:56:30
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \admin-client\src\pages\admin\pages\charts\bar.jsx
 */
/**
 * 后台管理的柱状图路由组件
 */
import React, {Component} from 'react'
import {Card, Button} from 'antd'
import ReactEcharts from 'echarts-for-react'

export default class Bar extends Component {
    state = {
        sales: [5, 20, 36, 10, 10, 20], // 销量的数组
        stores: [6, 10, 25, 20, 15, 10] // 库存的数组
    }

    updateData = ()=>{
        this.setState((state)=>({
            sales: state.sales.map(sale=>sale+1),
            stores: state.stores.reduce((pre, store)=>{
                pre.push(store-1)
                return pre
            }, [])
        }))
    }

    getOption= (sales, stores)=>{
        return {
            title: {
                text: '销量城市Top6 销量与库存分析(单位：辆)'
            },
            tooltip: {},
            legend: {
                data: ['销量', '库存']
            },
            xAxis: {
                data: ['北京', '上海', '深圳', '成都', '西安', '南京']
            },
            yAxis: {},
            series: [
                {
                    name: '销量',
                    type: 'bar',
                    // data: [5, 20, 36, 10, 10, 20]
                    data: sales
                },
                {
                    name: '库存',
                    type: 'bar',
                    // data: [6, 10, 25, 20, 15, 10]
                    data: stores
                }
            ]
        }
    }


    render() {
        const { sales, stores } = this.state
        return (
            <div>
                <Card>
                    <Button type='primary' onClick={this.updateData}>更新</Button>
                </Card>

                <Card title='城市销量与库存分析'>
                    <ReactEcharts option={this.getOption(sales, stores)} style={{paddingTop:40, height:500}}/>
                </Card>
            </div>
        )
    }
}
