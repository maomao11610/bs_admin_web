/**
 * 首页柱状图
 */
import React, {Component} from 'react'
import { Chart, Interval, Tooltip } from 'bizcharts'

export default class Bar extends Component {
    // 此处数据最佳在数据库取，直接展示平台销量下单情况
// （订单列表这的条数，按时间化值求和）
    saleData = [
        {
            month: "1月",
            sales: 38
        },
        {
            month: "2月",
            sales: 52
        },
        {
            month: "3月",
            sales: 61
        },
        {
            month: "4月",
            sales: 145
        },
        {
            month: "5月",
            sales: 48
        },
        {
            month: "6月",
            sales: 38
        },
        {
            month: "7月",
            sales: 28
        },
        {
            month: "8月",
            sales: 38
        },
        {
            month: "9月",
            sales: 68
        },
        {
            month: "10月",
            sales: 38
        },
        {
            month: "11月",
            sales: 58
        },
        {
            month: "12月",
            sales: 268
        }
    ]
    // visitData = [
    //     {
    //         month: "1月",
    //         sales: 20
    //     },
    //     {
    //         month: "2月",
    //         sales: 36
    //     },
    //     {
    //         month: "3月",
    //         sales: 45
    //     },
    //     {
    //         month: "4月",
    //         sales: 32
    //     },
    //     {
    //         month: "5月",
    //         sales: 37
    //     },
    //     {
    //         month: "6月",
    //         sales: 38
    //     },
    //     {
    //         month: "7月",
    //         sales: 40
    //     },
    //     {
    //         month: "8月",
    //         sales: 29
    //     },
    //     {
    //         month: "59月",
    //         sales: 35
    //     },
    //     {
    //         month: "10月",
    //         sales: 37
    //     },
    //     {
    //         month: "11月",
    //         sales: 41
    //     },
    //     {
    //         month: "12月",
    //         sales: 46
    //     }
    // ]
    render() {
        const data =  this.saleData
        return (
            <div style={{width:'100%'}}>
                <Chart height={260} autoFit data={data} >
                    <Interval position="month*sales" />
                    <Tooltip shared/>
                </Chart>
            </div>
        )
    }
}
