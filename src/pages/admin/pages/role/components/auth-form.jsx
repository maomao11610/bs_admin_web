import React, {Component} from 'react'
import {Form, Input, Tree} from 'antd'
import PropTypes from 'prop-types'
import menuList from '../../../../../config/menuConfig'
const { TreeNode } = Tree

export default class AuthForm extends Component {
    static propTypes = {
        role: PropTypes.object.isRequired
    }
    constructor(props) {
        super(props)

        const {menus} = this.props.role  // 根据传入角色的menus生成初始状态
        this.state = {
            checkedKeys: menus
        }
    }

    getTreeNodes = (menuList)=>{
        /*return menuList.map(menu=>{
            return (
                <TreeNode title={menu.title} key={menu.key}>
                    {
                        (menu.children && menu.children.length>0) ? this.getTreeNodes(menu.children) : null
                    }
                </TreeNode>
            )
        })*/
        return menuList.reduce((pre, item)=>{
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    {
                        (item.children && item.children.length>0) ? this.getTreeNodes(item.children) : null
                    }
                </TreeNode>
            )
            return pre
        }, [])
    }

    // 选中某个Node时的回调
    onCheck = checkedKeys => {
        console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys });
    }

    // 为父组件提交获取最新menus数据的方法
    getMenus = ()=>this.state.checkedKeys


    UNSAFE_componentWillMount() {
        this.treeNodes = this.getTreeNodes(menuList)
    }

    // 根据新传入的role来更新checkedKeys状态
    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        // 当组件接收到新的属性时自动调用
        // console.log('componentWillReceiveProps()', nextProps, nextContext)
        const menus = nextProps.role.menus
        this.setState({
            checkedKeys: menus
        })
    }

    render() {
        const {role} = this.props
        const { checkedKeys } = this.state
        const formItemLayout = {  // 指定Item布局的配置对象
            labelCol: { span: 4 },   // 左侧label的宽度
            wrapperCol: { span: 20 }  // 右侧包裹的宽度
        }
        return (
            <div>
                <Form.Item label="角色名称" {...formItemLayout}>
                    <Input value={role.name} disabled/>
                </Form.Item>

                <Tree checkable defaultExpandAll={true} checkedKeys={checkedKeys} onCheck={this.onCheck}>
                    <TreeNode title="平台权限" key="all">
                        {this.treeNodes}
                    </TreeNode>
                </Tree>
            </div>
        )
    }
}
