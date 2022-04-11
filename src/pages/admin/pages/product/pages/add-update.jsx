/**
 * Product的添加和更新的子路由组件
 */
import React, {Component} from 'react'
import { Card, Form, Input, Cascader, Button, Icon, message } from 'antd'
import LinkButton from '../../../../../components/link-button/LinkButton'
import { reqCategoryList, reqAddUpdateProduct } from '../../../../../api/index'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
import memoryUtils from "../../../../../utils/memoryUtils";
const { Item } = Form
const { TextArea } = Input

class ProductAddUpdate extends Component {
    constructor(props) {
        super(props)

        // 创建用来保存ref标识的标签对象的容器
        this.pw= React.createRef()
        this.editor = React.createRef()
    }
    state = {
        options: []
    }

    // 验证价格的自定义验证函数
    validatePrice = (rule, value, callback)=>{
        // console.log(rule, value, callback)
        if(value*1>0) {  // 验证通过
            callback()
        } else { // 验证没通过
            callback('价格必须大于0')
        }
    }

    initOptions = async (categoryList)=>{
        const options = categoryList.map(item=>{  // 根据categoryList生成options数组
            return {
                value: item._id,
                label: item.name,
                isLeaf: false // 不是叶子
            }
        })

        // 如果是一个二级分类商品的更新
        const {isUpdate, product} = this
        const {pCategoryId} = product
        if(isUpdate && pCategoryId!=='0') {
            const subCategoryList = await this.getCategoryList(pCategoryId)  // 获取对应的二级分类列表
            const childrenOptions = subCategoryList.map(item=>{  // 生成二级下拉列表的options
                return {
                    label: item.name,
                    value: item._id,
                    isLeaf: true
                }
            })
            const targetOption = options.find(option=>option.value===pCategoryId)  // 找到当前商品对应的一级option对象
            targetOption.children = childrenOptions  // 关联对应的一级option上
        }

        this.setState({  // 更新options状态
            options: options
        })
    }

    // 异步获取一级/二级分类列表, 并显示   -- async函数的返回值是一个新的promise对象, promise的结果和值由async函数的结果来决定
    getCategoryList = async (parentId)=>{
        const result = await reqCategoryList(parentId)
        if(result.status===0) {
            const categoryList = result.data
            if (parentId==='0') {  // 如果是一级分类列表
                this.initOptions(categoryList)
            } else { // 二级列表
                return categoryList  // 返回二级列表 ==> 当前async函数返回的promise就会进入成功状态且value为categoryList
            }
        }
    }

    // 用加载下一级列表的回调函数
    loadData = async selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1]  // 得到选择的option对象
        targetOption.loading = true  // 显示loading

        const subCategoryList = await this.getCategoryList(targetOption.value)  // 根据选中的分类, 请求获取二级分类列表
        targetOption.loading = false  // 隐藏loading
        if(subCategoryList && subCategoryList.length>0) {  // 二级分类数组有数据
            const childrenOptions = subCategoryList.map(item=>{
                return {
                    label: item.name,
                    value: item._id,
                    isLeaf: true
                }
            })
            targetOption.children = childrenOptions  // 关联到当前option上
        } else {  // 当前选中的分类没有二级分类
            targetOption.isLeaf = true
        }

        this.setState({  // 更新options状态
            options: [...this.state.options],  // this.state.options里的某一项数据发生了改变
        })

    }

    // 提交
    submit = ()=>{
        this.props.form.validateFields(async (error, values)=>{  // 进行表单验证, 如果通过了, 才发送请求
            if(!error) {
                // 1. 收集数据, 并封装成product对象
                const {name, desc, price, categoryIds} = values
                let pCategoryId, categoryId
                if(categoryIds.length===1) {
                    pCategoryId = '0'
                    categoryId = categoryIds[0]
                } else {
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                }
                const imgs = this.pw.current.getImgList()
                const detail = this.editor.current.getDetail()
                // console.log('@@@@',values, imgs, detail)
                const product = {
                    name, desc, price, pCategoryId, categoryId, imgs, detail
                }
                if(this.isUpdate) {  // 如果是更新, 需要添加_id
                    product._id = this.product._id
                }

                // 2. 调用接口请求函数去添加/更新
                const result = await reqAddUpdateProduct(product)

                // 3. 根据结果提示
                if (result.status===0) {
                    message.success(`${this.isUpdate ? '更新' : '添加'}商品成功!`)
                    this.props.history.goBack()
                } else {
                    message.error(`${this.isUpdate ? '更新' : '添加'}商品失败!`)
                }
            }
        })
    }

    UNSAFE_componentWillMount() {
        // BrowserRouter
        /*
        const product = this.props.location.state    // 取出携带的state, 如果是添加商品则没值, 否则有值
        // this.isUpdate = !!product  // 保存是否是更新的标识
        // this.product = product || {}  // 保存商品(如果没有, 保存是{})
        if(product) {
            this.isUpdate = true
            this.product = product
        } else{
            this.isUpdate = false
            this.product = {}
        }
        */


        // HashRouter
        const product = memoryUtils.product
        this.isUpdate = !!product._id  // 保存是否是更新的标识
        this.product = product || {}  // 保存商品(如果没有, 保存是{})
    }

    componentDidMount() {
        this.getCategoryList('0')
    }
    // 在卸载之前清除保存的数据
    componentWillUnmount() {
        // HashRouter
        memoryUtils.product = {}
    }

    render() {
        const {isUpdate, product} = this
        const {pCategoryId, categoryId, imgs, detail} = product
        const categoryIds = []  // 用来接收级联分类ID的数组
        if(isUpdate) {
            if(pCategoryId==='0') {  // 商品是一个一级分类的商品
                categoryIds.push(categoryId)
            } else {  // 商品是一个二级分类的商品
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }

        const title = (  // 头部左侧标题
            <span>
                <LinkButton onClick={()=>{this.props.history.goBack()}}>
                    <Icon type="arrow-left" style={{fontSize:16}}/>
                </LinkButton>
                <span>{ this.isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        )
        const formItemLayout = {  // 指定Item布局的配置对象
            labelCol: { span: 4 },   // 左侧label的宽度
            wrapperCol: { span: 10 }  // 右侧包裹的宽度
        }

        const {getFieldDecorator} = this.props.form
        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label="商品名称">
                        {
                            getFieldDecorator('name', {
                                rules: [{required: true, message: '必须输入商品名称'}],
                                initialValue: product.name
                            })(
                                <Input placeholder="请输入商品名称"/>
                            )
                        }
                    </Item>
                    <Item label="商品描述">
                        {
                            getFieldDecorator('desc', {
                                rules: [{required: true, message: '必须输入商品描述'}],
                                initialValue: product.desc
                            })(
                                <TextArea placeholder="请输入商品描述" autosize={{ minRows: 1, maxRows: 6 }}/>
                            )
                        }
                    </Item>
                    <Item label="商品价格">
                        {
                            getFieldDecorator('price', {
                                rules: [
                                    {required: true, message: '必须输入商品价格'},
                                    {validator: this.validatePrice}
                                ],
                                initialValue: product.price
                            })(
                                <Input type="number" addonAfter="元" placeholder="请输入商品价格"/>
                            )
                        }
                    </Item>
                    <Item label="商品分类">
                        {
                            getFieldDecorator('categoryIds', {
                                rules: [{required: true, message: '必须指定商品分类'}],
                                initialValue: categoryIds
                            })(
                                <Cascader options={this.state.options}   /*需要显示的列表数据数组*/
                                          loadData={this.loadData}  /*当选择某个列表项, 加载下一级列表的监听回调*/
                                          placeholder="请指定商品分类"/>
                            )
                        }
                    </Item>
                    <Item label="商品图片" labelCol={{span: 4}} wrapperCol={{span: 16}}>
                        <PicturesWall ref={this.pw} imgs={imgs}/>
                    </Item>
                    <Item label="商品详情" labelCol={{span: 4}} wrapperCol={{span: 16}}>
                        <RichTextEditor ref={this.editor} detail={detail}/>
                    </Item>
                    <Item wrapperCol={{span:10, offset: 4}}>
                        <Button type="primary" onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}
export default Form.create()(ProductAddUpdate)


/*
1. 子组件调用父组件的方法: 将父组件的方法以函数属性的形式传递给子组件, 子组件就可以调用
2. 父组件调用子组件的方法: 在父组件中通过ref得到子组件标签对象(也就是组件对象), 调用其方法
    使用ref:
        1. 创建ref容器: this.pw = React.createRef()
        2. 将ref容器交给需要获取的标签元素: <PictureWall ref={this.pw} />
        3. 通过ref容器读取标签元素: this.pw.current
 */

/*
class ProductAddUpdate extends Component {
    state = {
        fileList: [],
        options: [
            {
                value: 'zhejiang',
                label: 'Zhejiang',
                isLeaf: false,
            },
            {
                value: 'jiangsu',
                label: 'Jiangsu',
                isLeaf: false,
            },
            {
                value: 'jiangsu',
                label: 'Jiangsu',
                isLeaf: true,
            },
        ]
    }

    // 验证价格的自定义验证函数
    validatePrice = (rule, value, callback)=>{
        console.log(rule, value, callback)
        if(value*1>0) {  // 验证通过
            callback()
        } else { // 验证没通过
            callback('价格必须大于0')
        }
    }

    // 用加载下一级列表的回调函数
    loadData = selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1]  // 得到选择的option对象
        targetOption.loading = true  // 显示loading

        setTimeout(() => {  // 模拟请求异步获取二级列表数据(懒加载)
            targetOption.loading = false  // 隐藏loading
            targetOption.children = [
                {
                    label: `${targetOption.label} Dynamic 1`,
                    value: 'dynamic1',
                    isLeaf: true
                },
                {
                    label: `${targetOption.label} Dynamic 2`,
                    value: 'dynamic2',
                    isLeaf: true
                },
            ];
            this.setState({  // 更新options状态
                options: [...this.state.options],  // this.state.options里的某一项数据发生了改变
            });
        }, 1000);
    };

    // 提交
    submit = ()=>{
        this.props.form.validateFields(async (error, values)=>{  // 进行表单验证, 如果通过了, 才发送请求
            if(!error) {
                message.success('验证成功')
            }
        })
    }
    render() {
        const { fileList } = this.state
        const title = (  // 头部左侧标题
            <span>
                <LinkButton>
                    <Icon type="arrow-left" style={{fontSize:16}}/>
                </LinkButton>
                <span>添加商品</span>
            </span>
        )
        const formItemLayout = {  // 指定Item布局的配置对象
            labelCol: { span: 2 },   // 左侧label的宽度
            wrapperCol: { span: 10 }  // 右侧包裹的宽度
        }
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        )
        const {getFieldDecorator} = this.props.form
        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label="商品名称：">
                        {
                            getFieldDecorator('name', {
                                rules: [{required: true, message: '必须输入商品名称'}],
                                initialValue: ''
                            })(
                                <Input placeholder="请输入商品名称"/>
                            )
                        }
                    </Item>
                    <Item label="商品描述：">
                        {
                            getFieldDecorator('desc', {
                                rules: [{required: true, message: '必须输入商品描述'}],
                                initialValue: ''
                            })(
                                <TextArea placeholder="请输入商品描述" autosize={{ minRows: 1, maxRows: 6 }}/>
                            )
                        }
                    </Item>
                    <Item label="商品价格：">
                        {
                            getFieldDecorator('price', {
                                rules: [
                                    {required: true, message: '必须输入商品价格'},
                                    {validator: this.validatePrice}
                                ],
                                initialValue: ''
                            })(
                                <Input type="number" addonAfter="元" placeholder="请输入商品价格"/>
                            )
                        }
                    </Item>
                    <Item label="商品分类：">
                        {
                            getFieldDecorator('categoryIds', {
                                rules: [{required: true, message: '必须指定商品分类'}],
                                initialValue: []
                            })(
                                <Cascader options={this.state.options}   /!*需要显示的列表数据数组*!/
                                          loadData={this.loadData}  /!*当选择某个列表项, 加载下一级列表的监听回调*!/
                                          placeholder="请指定商品分类"/>
                            )
                        }
                    </Item>
                    <Item label="商品图片：">
                        <Upload
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={this.handlePreview}
                            onChange={this.handleChange}
                        >
                            {fileList.length >= 8 ? null : uploadButton}
                        </Upload>
                    </Item>
                    <Item label="商品详情：">
                        <Input/>
                    </Item>
                    <Item>
                        <Button type="primary" onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}
export default Form.create()(ProductAddUpdate)*/
