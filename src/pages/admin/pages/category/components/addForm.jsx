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
                <Form.Item label="所属分类">
                    {getFieldDecorator('parentId', { initialValue: parentId })(
                        <Select>
                            <Option value='0'>一级分类</Option>
                            {
                                categoryList.map(item => <Option value={item._id} key={item._id}>{item.name}</Option>)
                            }
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="分类名称">
                    {getFieldDecorator('categoryName', {
                            rules: [{required: true, message: '分类名称不能为空!'}],
                            initialValue: ''
                        })(
                            <Input placeholder="请输入分类名称"/>
                        )
                    }
                </Form.Item>

            </Form>
        )
    }
}

export default Form.create()(AddForm)
