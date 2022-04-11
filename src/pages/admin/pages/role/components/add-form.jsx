import React, {Component} from 'react'
import {Form, Input} from 'antd'
import PropTypes from 'prop-types'

class AddForm extends Component {
    static propTypes = {
        setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
    }

    componentDidMount() {
        this.props.setForm(this.props.form)
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {  // 指定Item布局的配置对象
            labelCol: { span: 4 },   // 左侧label的宽度
            wrapperCol: { span: 20 }  // 右侧包裹的宽度
        }
        return (
            <Form {...formItemLayout}>
                <Form.Item label="角色名称">
                    {getFieldDecorator('roleName', {
                        rules: [{required: true, message: '角色名称不能为空!'}],
                        initialValue: ''
                    })(
                        <Input placeholder="请输入角色名称"/>
                    )
                    }
                </Form.Item>
            </Form>
        )
    }
}
export default Form.create()(AddForm)
