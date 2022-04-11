/**
 * 商品路由
 */
import React, {Component} from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import ProductHome from './pages/home'
import ProductAddUpdate from './pages/add-update'
import ProductDetail from './pages/detail'
import './product.less'

export default class Product extends Component {

    render() {
        return (
            <Switch>
                <Route exact path='/product' component={ProductHome}></Route> {/*路径完全匹配*/}
                <Route path='/product/add_update' component={ProductAddUpdate}></Route>
                <Route path='/product/detail' component={ProductDetail}></Route>
                <Redirect to='/product'/>
            </Switch>
        )
    }
}
