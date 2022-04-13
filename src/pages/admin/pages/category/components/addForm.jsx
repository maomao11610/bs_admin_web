/*
 * @Author: your name
 * @Date: 2022-04-09 15:12:39
 * @LastEditTime: 2022-04-13 16:43:38
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD
 * @FilePath: \admin-client\src\pages\admin\pages\category\components\addForm.jsx
 */
import React, {Component} from 'react'
import { Form, Select, Input } from 'antd'
import PropTypes from 'prop-types'
const { Option } = Select
class AddForm extends Component {
    static propTypes = {
        setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
        categoryList: PropTypes.array.isRequired, // 一级分类的数组
        parentId: PropTypes.string.isRequired, // 父分类的ID
    }

    componentDidMount() {
        this.props.setForm(this.props.form)
    }

    render() {
        const { categoryList, parentId } = this.props
        const { getFieldDecorator } = this.props.form
        // console.log(categoryList)
        const formItemLayout = {  // 指定Item布局的配置对象
            labelCol: { span: 4 },   // 左侧label的宽度
            wrapperCol: { span: 20 }  // 右侧包裹的宽度
        }
        return (
            <Form {...formItemLayout}>
                <Form.Item label="所属品牌">
                    {getFieldDecorator('parentId', { initialValue: parentId })(
                        <Select>
                            <Option value='0'>car</Option>
                            {
                                categoryList.map(item => <Option value={item._id} key={item._id}>{item.name}</Option>)
                            }
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="车系名称">
                    {getFieldDecorator('categoryName', {
                            rules: [{required: true, message: '车系名称不能为空!'}],
                            initialValue: ''
                        })(
                            <Input placeholder="请输入车系名称"/>
                        )
                    }
                </Form.Item>

            </Form>
        )
    }
}

export default Form.create()(AddForm)
