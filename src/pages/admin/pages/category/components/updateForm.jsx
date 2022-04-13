/*
 * @Author: your name
 * @Date: 2022-04-09 15:12:39
 * @LastEditTime: 2022-04-13 16:42:55
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \admin-client\src\pages\admin\pages\category\components\updateForm.jsx
 */
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
                <Form.Item label="所属品牌">
                    {getFieldDecorator('categoryName', {
                            rules: [{required: true, message: '车系名称不能为空!'}],
                            initialValue: categoryName
                        })(
                            <Input placeholder="请输入车系名称"/>
                        )
                    }
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create()(UpdateForm)
