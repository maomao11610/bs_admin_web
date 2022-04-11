/**
 * 更新分类的form组件
 */
import React, {Component} from 'react'
import { Form, Input } from 'antd'
import PropTypes from 'prop-types'  // yarn add prop-types

class UpdateForm extends Component {
    static propTypes = {
        categoryName: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }

    componentDidMount() {
        // 将form对象通过setForm()传递父组件
        this.props.setForm(this.props.form)
    }
    render() {
        const { categoryName } = this.props
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {  // 指定Item布局的配置对象
            labelCol: { span: 4 },   // 左侧label的宽度
            wrapperCol: { span: 20 }  // 右侧包裹的宽度
        }
        return (
            <Form {...formItemLayout}>
                <Form.Item label="分类名称">
                    {getFieldDecorator('categoryName', {
                            rules: [{required: true, message: '分类名称不能为空!'}],
                            initialValue: categoryName
                        })(
                            <Input placeholder="请输入分类名称"/>
                        )
                    }
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create()(UpdateForm)
