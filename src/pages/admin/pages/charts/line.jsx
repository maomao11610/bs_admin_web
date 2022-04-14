/*
 * @Author: your name
 * @Date: 2022-04-09 15:12:39
 * @LastEditTime: 2022-04-14 15:55:27
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \admin-client\src\pages\admin\pages\charts\line.jsx
 */
/**
 * 后台管理的折线图路由组件
 */
import React, {Component} from 'react'
import {Card, Button} from 'antd'
import ReactEcharts from 'echarts-for-react'

export default class Line extends Component {
    state = {
        sales: [5, 20, 36, 10, 10, 20,60, 103, 48, 67, 77, 13], // 销量的数组
        stores: [6, 10, 25, 20, 15, 10,35,67,99,204,10,126] // 库存的数组
    }

    update = ()=>{
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
                text: '系统年销售分析(单位：辆)'
            },
            tooltip: {},
            legend: {
                data: ['去年', '今年']
            },
            xAxis: {
                data: ['1月', '2月', '3月', '4月', '5月', '6月','7月', '8月', '9月', '10月', '11月', '12月']
            },
            yAxis: {},
            series: [
                {
                    name: '去年',
                    type: 'line',
                    // data: [5, 20, 36, 10, 10, 20]
                    data: sales
                },
                {
                    name: '今年',
                    type: 'line',
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
                    <Button type='primary' onClick={this.update}>更新</Button>
                </Card>

                <Card title='系统销售分析'>
                    <ReactEcharts option={this.getOption(sales, stores)} style={{paddingTop:40, height:500}}/>
                </Card>

            </div>
        )
    }
}
