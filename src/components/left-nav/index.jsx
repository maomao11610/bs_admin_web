/**
 * 左侧导航的组件
 */
import React, {Component} from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd'
import menuList from '../../config/menuConfig'
import logo from '../../assets/images/logo1.png'
import './index.less'
import memoryUtils from '../../utils/memoryUtils'

const { SubMenu } = Menu;

class LeftNav extends Component {

    /**
     * 判断当前登陆用户对item是否有权限, 有四种情况：
     *   1.如果当前用户是admin
     *   2.如果当前item是公开的
     *   3.当前用户有此item的权限(即key在menus中)
     *   4.如果当前用户有此item的某个子item的权限
     */
    hasAuth = (item)=>{
        const { key, isPublic } = item
        const menus = memoryUtils.user.role.menus  // 当前用户的权限列表
        const username = memoryUtils.user.username // 当前用户的用户名
        if(username==='admin' || isPublic || menus.indexOf(key)!==-1) {
            return true
        } else if(item.children) {
            return !!item.children.find(child=>menus.indexOf(child.key)!==-1)
        }
        return false
    }

    // 根据menu的数据数组生成对应的标签数组  使用reduce() + 递归调用
    getMenuNodes = (menuList)=>{
        const path = this.props.location.pathname
        // console.log(path)

        return menuList.reduce((pre, item)=>{
            // 如果当前用户有item对应的权限, 才需要显示对应的菜单项
            if(this.hasAuth(item)) {

                if(!item.children) {
                    pre.push((  // 向pre添加<Menu.Item>
                        <Menu.Item key={item.key}>
                            <Link to={item.key}>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    ))
                } else {
                    // const cItem = item.children.find(cItem=>cItem.key===path)  // 查找一个与当前请求路径匹配的子Item
                    const cItem = item.children.find(cItem=>path.indexOf(cItem.key)===0)  // 查找一个是当前请求路径的前缀的子Item
                    if (cItem) {  // 如果存在, 说明当前item的子列表需要打开
                        this.openKey = item.key
                    }

                    pre.push((  // 向pre添加<SubMenu>
                        <SubMenu key={item.key} title={
                            <span>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </span>
                        }>
                            {
                                this.getMenuNodes(item.children)
                            }
                        </SubMenu>
                    ))
                }

            }
            return pre
        }, [])
    }

    // 在第一次render()之前执行一次, 作用是为第一个render渲染准备数据(必须同步的)
    UNSAFE_componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList)
        // console.log(this.menuNodes)
    }

    render() {
        // debugger
        let path = this.props.location.pathname
        // console.log('render()', path)
        if(path.indexOf('/product')===0) { // 当前请求的是商品或其子路由界面
            // 解决进入商品管理详情页/product/detail的时出现商品管理项未选中的情况
            path = '/product'
        }

        const openKey = this.openKey   // 得到需要打开菜单项的key
        return (
            <div>
                <div className="left-nav">
                    <Link to='/' className="left-nav-header">
                        <img src={logo} alt="logo"/>
                        <h1>趣摩后台管理</h1>
                    </Link>
                </div>
                <Menu mode="inline" theme="dark" selectedKeys={[path]} defaultOpenKeys={[openKey]}>
                    {
                        this.menuNodes
                    }
                </Menu>
            </div>
        )
    }
}

// LeftNav是非路由组件,要想获得路由组件中的一些属性,需要用withRouter来包装
// withRouter高阶组件:
//    1.包装非路由组件, 返回一个新的组件
//    2.新的组件向非路由组件传递3个属性: history/location/match
export default withRouter(LeftNav)




/*
export default class LeftNav extends Component {
    // 根据menu的数据数组生成对应的标签数组  使用reduce() + 递归调用
    getMenuNodes = (menuList)=>{
        return menuList.reduce((pre, item)=>{
            if(!item.children) {
                pre.push((  // 向pre添加<Menu.Item>
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                ))
            } else {
                pre.push((  // 向pre添加<SubMenu>
                    <SubMenu key={item.key} title={
                        <span>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </span>
                    }>
                        {
                            this.getMenuNodes(item.children)
                        }
                    </SubMenu>
                ))
            }
            return pre
        }, [])
    }
    render() {
        return (
            <div>
                <div className="left-nav">
                    <Link to='/' className="left-nav-header">
                        <img src={logo} alt="logo"/>
                        <h1>后台管理</h1>
                    </Link>
                </div>
                <Menu mode="inline" theme="dark" >
                    {
                        this.getMenuNodes(menuList)
                    }
                </Menu>
            </div>
        )
    }
}
*/

/*
export default class LeftNav extends Component {
    // 根据menu的数据数组生成对应的标签数组  使用map() + 递归调用
    getMenuNodes = (menuList)=>{
        return menuList.map(item=>{
            if(!item.children) {
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            } else {
                return (
                    <SubMenu key={item.key} title={
                        <span>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </span>
                    }>
                        {
                            this.getMenuNodes(item.children)
                        }
                    </SubMenu>
                )
            }
        })
    }
    render() {
        return (
            <div>
                <div className="left-nav">
                    <Link to='/' className="left-nav-header">
                        <img src={logo} alt="logo"/>
                        <h1>后台管理</h1>
                    </Link>
                </div>
                <Menu mode="inline" theme="dark" >
                    {
                        this.getMenuNodes(menuList)
                    }
                </Menu>
            </div>
        )
    }
}
*/

/*
export default class LeftNav extends Component {
    render() {
        return (
            <div>
                <div className="left-nav">
                    <Link to='/' className="left-nav-header">
                        <img src={logo} alt="logo"/>
                        <h1>后台管理</h1>
                    </Link>
                </div>
                <Menu mode="inline" theme="dark" >
                    <Menu.Item key="1">
                        <Link to="/home">
                            <Icon type="pie-chart" />
                            <span>首页</span>
                        </Link>
                    </Menu.Item>
                    <SubMenu key="sub1" title={
                        <span>
                            <Icon type="mail" />
                            <span>商品</span>
                        </span>
                    }>
                        <Menu.Item key="5">
                            <Link to="/category">
                                <Icon type="mail" />
                                <span>品类管理</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="6">
                            <Link to="/product">
                                <Icon type="mail" />
                                <span>商品管理</span>
                            </Link>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </div>
        )
    }
}
*/

