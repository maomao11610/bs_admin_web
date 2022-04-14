/**
 * 后台管理的饼图路由组件
 */
import React, {Component} from 'react'
import {Card} from 'antd'
import ReactEcharts from 'echarts-for-react'

export default class Pie extends Component {

    getOption = () => {
        return {
            title : {
                text: '趣摩APP用户来源分析',
                subtext: '数据爬取于互联网',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['直接访问','好友推荐','联盟广告','视频广告','搜索引擎']
            },
            series : [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[
                        {value:335, name:'直接访问'},
                        {value:310, name:'好友推荐'},
                        {value:234, name:'联盟广告'},
                        {value:135, name:'视频广告'},
                        {value:1548, name:'搜索引擎'}
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

    }

    getOption2 = () => {
        return {
            backgroundColor: '#2c343c',

            title: {
                text: '系统用户访问内容分析',
                left: 'center',
                top: 20,
                textStyle: {
                    color: '#ccc'
                }
            },

            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },

            visualMap: {
                show: false,
                min: 80,
                max: 600,
                inRange: {
                    colorLightness: [0, 1]
                }
            },
            series : [
                {
                    name:'访问目的',
                    type:'pie',
                    radius : '55%',
                    center: ['50%', '50%'],
                    data:[
                        {value:335, name:'游览'},
                        {value:310, name:'观望'},
                        {value:274, name:'收藏喜爱'},
                        {value:235, name:'下单'},
                        {value:400, name:'信息发布'}
                    ].sort(function (a, b) { return a.value - b.value; }),
                    roseType: 'radius',
                    label: {
                        normal: {
                            textStyle: {
                                color: 'rgba(255, 255, 255, 0.3)'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            lineStyle: {
                                color: 'rgba(255, 255, 255, 0.3)'
                            },
                            smooth: 0.2,
                            length: 10,
                            length2: 20
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#c23531',
                            shadowBlur: 200,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },

                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function (idx) {
                        return Math.random() * 200;
                    }
                }
            ]
        };
    }

    render() {
        return (
            <div>
                {/* 精准用户投放 */}
                <Card title='趣摩用户来源分析'>
                    <ReactEcharts option={this.getOption()} style={{height: 300}}/>
                </Card>
                <Card title='用户系统访问内容分析'>
                    <ReactEcharts option={this.getOption2()} style={{height: 300}}/>
                </Card>
            </div>
        )
    }
}
