/**
 * 角色路由
 */
import React, {Component} from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import {formatDate}  from '../../../../utils/dateUtils'
import { reqRoleList, reqAddRole, reqUpdateRole } from '../../../../api'
import AddForm from './components/add-form'
import AuthForm from './components/auth-form'
import memoryUtils from '../../../../utils/memoryUtils'
import storageUtils from '../../../../utils/storageUtils'

export default class Role extends Component {
    state = {
        roles: [], // 所有角色的列表
        role: {}, // 选中的role
        isShowAdd: false, // 是否显示添加界面
        isShowAuth: false, // 是否显示设置权限界面
    }
    constructor(props) {
        super(props)

        this.auth = React.createRef()
    }

    // 初始化表格的列项
    initColumns = ()=>{
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (time) => formatDate(time)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                // render: (time) => formatDate(time)
                render: formatDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            }
        ]
    }
    // 获取角色列表
    getRoleList = async ()=>{
        const result = await reqRoleList()
        if(result.status===0) {
            this.setState({
                roles: result.data
            })
        }
    }

    // 设置表格的行属性
    onRow = (role)=>{
        return {
            onClick: event => { // 点击行
                this.setState({
                    role: role
                })
            },
        }
    }

    handleAddCancel = ()=>{
        this.setState({isShowAdd: false})
        this.addForm.resetFields()
    }
    // 添加角色
    addRole = ()=>{
        this.addForm.validateFields(async (error, values)=>{
            if(!error) {
                this.setState({  // 隐藏确认框
                    isShowAdd: false
                })
                const roleName = values.roleName
                this.addForm.resetFields()
                const result = await reqAddRole(roleName)
                if(result.status===0) {  // 根据结果提示/更新列表显示
                    message.success('添加角色成功!')

                    // this.getRoleList()

                    const role = result.data  // 新产生的角色
                    this.setState(state=>({  // 更新roles状态: 基于原本状态数据更新
                        roles: [...state.roles, role]
                    }))

                } else {
                    message.success('添加角色失败!')
                }
            }
        })
    }

    handleUpdateCancel = ()=>{
        this.setState({isShowAuth: false})
    }
    // 设置角色权限
    updateRole = async ()=>{
        this.setState({  // 隐藏确认框
            isShowAuth: false
        })

        const role = this.state.role
        const menus = this.auth.current.getMenus()  // 得到最新的menus
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = memoryUtils.user.username
        const result = await reqUpdateRole(role)
        if(result.status === 0) {
            // this.getRoleList()  // 更新数据
            // message.success('设置角色权限成功')

            if(role._id === memoryUtils.user.role_id) {  // 如果当前更新的是自己角色的权限, 强制退出
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
                message.success('当前用户角色权限修改了,请重新登录！')
            } else {
                message.success('设置角色权限成功！')
                this.setState({
                    roles: [...this.state.roles]
                })
            }

        }

    }

    UNSAFE_componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getRoleList()
    }

    render() {
        const {roles, role, isShowAdd, isShowAuth} = this.state
        const title = (
            <span>
                <Button type="primary" onClick={()=>this.setState({isShowAdd: true})}>创建角色</Button> &nbsp;&nbsp;
                <Button type="primary" disabled={!role._id} onClick={()=>this.setState({isShowAuth: true})}>设置角色权限</Button>
            </span>
        )

        return (
            <Card title={title}>
                <Table bordered rowKey="_id" dataSource={roles} columns={this.columns}
                       onRow={this.onRow}  /*设置行属性*/
                       rowSelection={{  /*表格行是否可选择*/
                           type: 'radio',
                           selectedRowKeys: [role._id],  /*指定选中项的 key 数组*/
                           onSelect: (role) => { this.setState({ role }) } // 选择某个radio时回调
                       }}
                       pagination={{
                           defaultPageSize: 5, defaultCurrent: 1,
                           showSizeChanger:true, pageSizeOptions: ['5','10','20','40'],
                           showQuickJumper: true
                       }}/>

                <Modal title="添加角色" visible={isShowAdd} onOk={this.addRole} onCancel={this.handleAddCancel}>
                    <AddForm setForm={(form) => {this.addForm = form}} />
                </Modal>
                <Modal title="设置角色权限" visible={isShowAuth} onOk={this.updateRole} onCancel={this.handleUpdateCancel}>
                    <AuthForm ref={this.auth} role={role}/>
                </Modal>
            </Card>
        )
    }
}
