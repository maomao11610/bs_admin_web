/*
 * @Author: your name
 * @Date: 2022-04-09 15:12:39
 * @LastEditTime: 2022-04-10 16:24:45
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \admin-client\src\pages\admin\admin.jsx
 */
/**
 * 后台管理的路由组件
 */
import React, {Component} from 'react'
import { Redirect, Switch, Route } from 'react-router-dom'
import { Layout } from 'antd'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import memoryUtils from '../../utils/memoryUtils'
import Home from './pages/home/home'
import Category from './pages/category/category'
import Product from './pages/product/product'
import Role from './pages/role/role'
import User from './pages/user/user'
import Bar from './pages/charts/bar'
import Line from './pages/charts/line'
import Pie from './pages/charts/pie'
import Order from './pages/order/order'
import NotFound from './pages/not-found/not-found'

const { Footer, Sider, Content } = Layout


export default class Admin extends Component {
    render() {
        const user = memoryUtils.user
        if(!user || !user._id) {  // 如果内存没有存储user ==> 当前没有登陆
            return <Redirect to='/login' />   // 自动跳转到登陆(在render()中)
        }

        return (
            <Layout style={{minHeight: '100%'}}>
                <Sider>
                    <LeftNav />
                </Sider>
                <Layout>
                    <Header>Header</Header>
                    <Content style={{margin: 20, backgroundColor:'#fff'}}>
                       <Switch>
                           <Redirect exact from='/' to='/home'/>
                           <Route path='/home' component={Home}></Route>
                           <Route path='/category' component={Category}/>
                           <Route path='/product' component={Product}/>
                           <Route path='/user' component={User}/>
                           <Route path='/role' component={Role}/>
                           <Route path="/charts/bar" component={Bar}/>
                           <Route path="/charts/pie" component={Pie}/>
                           <Route path="/charts/line" component={Line}/>
                           <Route path="/order" component={Order}/>
                           <Route path="/order/list" component={Order}/>
                           <Route component={NotFound}/>  {/*上面没有一个匹配, 直接显示*/}
                       </Switch>
                    </Content>
                    <Footer style={{textAlign: 'center', color: '#ccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
                </Layout>
            </Layout>
        )
    }
}
