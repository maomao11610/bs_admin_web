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
                text: 'ECharts 销量与库存'
            },
            tooltip: {},
            legend: {
                data: ['销量', '库存']
            },
            xAxis: {
                data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
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

                <Card title='柱状图一'>
                    <ReactEcharts option={this.getOption(sales, stores)} style={{paddingTop:40, height:500}}/>
                </Card>
            </div>
        )
    }
}
