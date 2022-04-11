/**
 * 头部组件
 */
import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import { Modal } from 'antd'
import { formatDate } from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import {reqWeather} from '../../api'
import menuList from '../../config/menuConfig'
import LinkButton from '../link-button/LinkButton'
import './index.less'
import storageUtils from "../../utils/storageUtils";


class Header extends Component {
    state = {
        currentTime: formatDate(Date.now()),  // 当前时间字符串
        dayPictureUrl: '/images/sunny.gif', // 天气图片url
        weather: '', // 天气的描述文本
        temperature: '',  // 气温
        city: '' // 当前所在城市
    }
    getTime = ()=>{  // 每隔1s获取当前时间, 并更新状态数据currentTime
        this.intervalId = setInterval(()=>{
            const currentTime = formatDate(Date.now())
            this.setState({currentTime})
        }, 1000)
    }
    getWeather = async () => {
        const { city, temperature, weather } = await reqWeather()  // 调用接口请求异步获取数据
        this.setState({city, temperature, weather})  // 更新状态
    }
    getTitle = () => {
        const path = this.props.location.pathname  // 得到当前请求路径
        let title = ''
        menuList.forEach(item=>{
            if (item.key===path) { // 如果当前item对象的key与path一样,item的title就是需要显示的title
                title = item.title
            } else if (item.children) {
                let cItem = item.children.find(cItem=>path.indexOf(cItem.key)===0)  // 在所有子item中查找匹配的
                // 如果有值才说明有匹配的
                if(cItem) {
                    title = cItem.title
                }
            }
        })
        return title
    }

    logout = ()=>{  // 退出登陆
        Modal.confirm({
            title: '确定退出吗?',
            // content: 'Some descriptions',
            onOk: ()=>{
                // console.log('OK', this)

                // 1.删除保存的user数据
                storageUtils.removeUser()
                memoryUtils.user = {}

                // 2.跳转到login
                this.props.history.replace('/login')
            },
            onCancel() {
                // console.log('Cancel')
            },
        });
    }

    // 第一次render()之后执行一次 一般在此执行异步操作: 发ajax请求/启动定时器
    componentDidMount() {
        this.getTime() // 获取当前的时间
        this.getWeather()  // 获取当前天气
    }
    // 当前组件卸载之前调用
    componentWillUnmount () {
        clearInterval(this.intervalId)  // 清除定时器
    }

    render() {
        const { currentTime, weather, temperature, city } = this.state
        const username = memoryUtils.user.username
        const title = this.getTitle()  // 得到当前需要显示的title
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎, {username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">
                        {title}
                    </div>
                    <div className="header-bottom-right">
                        <span>{ currentTime }</span>
                        <span>{city}</span>
                        {/*<img src={this.state.dayPictureUrl} alt="weather"/>*/}
                        <span>{temperature}&nbsp;{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)

/*
export default class Header extends Component {
    render() {
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎, admin</span>
                    <a href="#" alt="">退出</a>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">
                        首页
                    </div>
                    <div className="header-bottom-right">
                        <span>2021-09-27 10:09:36</span>
                        <img src="/images/sunny.gif" alt=""/>
                        {/!*<img src="http://www.weather.com.cn/m/i/weatherpic/29x20/d0.gif" alt=""/>*!/}
                        <span>晴</span>
                    </div>
                </div>
            </div>
        )
    }
}
*/
