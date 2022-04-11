/*
 * @Author: your name
 * @Date: 2022-04-09 15:12:39
 * @LastEditTime: 2022-04-10 10:29:07
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \admin-client\src\pages\admin\pages\home\home.jsx
 */
/**
 * 后台首页路由
 */
import React, {Component} from 'react'
// Divider：分割线 Card：卡片（商品总量card）  Statistic：统计数值凸显：同比增长下降：写死的   DatePicker：日期选择
import { Divider, Icon, Card, Statistic, DatePicker, Timeline } from 'antd'
import './home.less'
import Bar from './components/bar'
import LineGraph from './components/line'

import moment from 'moment';
const {RangePicker} = DatePicker
const dateFormat = 'YYYY/MM/DD'

export default class Home extends Component {
    state = {
        isVisited: true
    }

    handleChange = (isVisited)=>{
        return ()=>this.setState({ isVisited })
    }

    render() {
        const {isVisited} = this.state
        const contentTitle = (
            <div className="home-menu">
                <span className={isVisited ? 'home-menu-left home-menu-active' : 'home-menu-left'}
                      onClick={this.handleChange(true)}>访问量</span>
                <span className={isVisited ? '' : 'home-menu-active'}
                      onClick={this.handleChange(false)}>销售量</span>
            </div>
        )
        const contentExtra = (
            <RangePicker defaultValue={[moment('2021/01/01', dateFormat), moment('2022/01/01', dateFormat)]}
                         format={dateFormat}/>
        )

        return (
            <div className="home">
                <div className="home-top">欢迎来到趣摩数据分析后台</div>
                <Divider />

                <Card className="home-card" title="商品总量" extra={<Icon type="question-circle" style={{color: 'rgba(0,0,0,.45)'}}/>}>
                    <Statistic value={1128163} valueStyle={{ fontWeight:'bolder' }} suffix="个" />
                    <Statistic value={15} valueStyle={{ fontSize: 15 }} prefix='周同比'
                        suffix={<div>%<Icon style={{color:'red', marginLeft:10}} type="arrow-down"/></div>}
                    />
                    <Statistic value={10} valueStyle={{ fontSize: 15 }} prefix={'日同比'}
                        suffix={<div>%<Icon style={{color:'#3f8600', marginLeft:10}} type="arrow-up"/></div>}
                    />
                </Card>

                <LineGraph/>
{/* 此处是柱状图 */}
                <Card className="home-content" title={contentTitle} extra={contentExtra}>
                    <Card 
                    className="home-table-left" 
                    title={isVisited ? '访问趋势' : '销售趋势'}
                   bodyStyle={{padding: 0, height: 275}} 
                   extra={<Icon type="reload"/>}>
                        <Bar isVisited={isVisited}/>
                    </Card>
{/* 任务卡 */}
                    {/* <Card title='任务' extra={<Icon type="reload"/>} className="home-table-right">
                        <Timeline>
                            <Timeline.Item color="green">新版本迭代会</Timeline.Item>
                            <Timeline.Item color="green">完成网站设计初版</Timeline.Item>
                            <Timeline.Item color="red">
                                <p>联调接口</p>
                                <p>功能验收</p>
                            </Timeline.Item>
                            <Timeline.Item color="gray">
                                <p>登录功能设计</p>
                                <p>权限验证</p>
                                <p>页面排版</p>
                            </Timeline.Item>
                        </Timeline>
                    </Card> */}
                </Card>

            </div>
        )
    }
}
