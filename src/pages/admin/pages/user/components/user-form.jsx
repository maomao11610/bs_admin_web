import React, {PureComponent} from 'react'
import {Form, Input, Select} from 'antd'
import PropTypes from 'prop-types'
const Option = Select.Option

class UserForm extends PureComponent {
    static propTypes = {
        setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
        roles: PropTypes.array.isRequired,
        user: PropTypes.object.isRequired
    }

    componentDidMount() {
        this.props.setForm(this.props.form)
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { roles, user } = this.props
        const formItemLayout = {  // 指定Item布局的配置对象
            labelCol: { span: 4 },   // 左侧label的宽度
            wrapperCol: { span: 20 }  // 右侧包裹的宽度
        }
        return (
            <Form {...formItemLayout}>
                <Form.Item label="用户名">
                    {getFieldDecorator('username', {
                            rules: [{required: true, message: '用户名不能为空!'}],
                            initialValue: user.username
                        })(
                            <Input placeholder="请输入用户名"/>
                        )
                    }
                </Form.Item>
                {
                    user._id ? null : (
                        <Form.Item label="密码">
                            {getFieldDecorator('password', {
                                    rules: [{required: true, message: '密码不能为空!'}],
                                    initialValue: ''
                                })(
                                    <Input type="password" placeholder="请输入密码"/>
                                )
                            }
                        </Form.Item>
                    )
                }
                <Form.Item label="电话">
                    {getFieldDecorator('phone', {
                            rules: [{required: true, message: '电话不能为空!'}],
                            initialValue: user.phone
                        })(
                            <Input placeholder="请输入电话"/>
                        )
                    }
                </Form.Item>
                <Form.Item label="邮箱">
                    {getFieldDecorator('email', {
                            rules: [{required: true, message: '邮箱不能为空!'}],
                            initialValue: user.email
                        })(
                            <Input placeholder="请输入邮箱"/>
                        )
                    }
                </Form.Item>
                <Form.Item label="所属角色">
                    {getFieldDecorator('role_id', {
                            rules: [{required: true, message: '所属角色不能为空!'}],
                            initialValue: user.role_id
                        })(
                            <Select placeholder="请指定所属角色">
                                {
                                    roles.map(role=>(<Option value={role._id} key={role._id}>{role.name}</Option>))
                                }
                            </Select>
                        )
                    }
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create()(UserForm)
