/**
 * 商品分类路由
 */
import React, {Component} from 'react'
import { Card, Table, Button, Icon, message, Modal } from 'antd'
import LinkButton from '../../../../components/link-button/LinkButton'
import { reqCategoryList, reqAddCategory, reqUpdateCategory } from '../../../../api/index'
import AddForm from './components/addForm'
import UpdateForm from './components/updateForm'

export default class Category extends Component {
    state = {
        loading: false, // 是否正在获取数据中
        categoryList: [],  // 一级分类列表
        subCategoryList: [],  // 二级分类列表
        parentId: '0', // 当前需要显示的分类列表的父分类ID
        parentName: '', // 当前需要显示的分类列表的父分类名称
        showStatus: 0, // 标识添加/更新的确认框是否显示, 0: 都不显示, 1: 显示添加, 2: 显示更新
    }

    // 初始化Table所有列的数组
    initColumns = ()=>{
        this.columns = [
            {
                title: '品牌',
                dataIndex: 'name'  // 指定显示数据的属性名
            },
            {
                title: '操作',
                width: 300,
                render: (category) => (  // 返回需要显示的界面标签
                    <span>
                        <LinkButton onClick={()=>this.showUpdateCategory(category)}>修改品牌</LinkButton>

                        {/*如何向事件回调函数传递参数: 先定义一个匿名函数, 在函数调用处理的函数并传入数据*/}
                        {
                            this.state.parentId==='0' ? (
                                <LinkButton onClick={()=>this.showSubCategoryList(category)}>查看车系</LinkButton>
                            ) : null
                        }
                    </span>
                )

            }
        ]
    }

    // 异步获取一级/二级分类列表显示
    getCategoryList = async (parentId)=>{  // parentId: 如果没有指定根据状态中的parentId请求, 如果指定了根据指定的请求
        this.setState({ loading: true })  // 在发请求前, 显示loading
        parentId = parentId || this.state.parentId
        const result = await reqCategoryList(parentId)  // 发异步ajax请求, 获取数据
        this.setState({loading: false})  // 在请求完成后, 隐藏loading
        if(result.status === 0 ) {
            const categoryList = result.data  // 取出分类数组(可能是一级也可能二级的)
            if(parentId==='0') {
                this.setState({categoryList})  // 更新一级分类状态
            } else {
                this.setState({subCategoryList: categoryList})  // 更新二级分类状态
            }
        } else {
            message.error('获取品牌列表失败')
        }
    }

    // 显示指定一级分类对象的二子列表
    showSubCategoryList = (category)=>{
        // console.log(category)
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, ()=>{  // 在状态更新且重新render()后执行
            // console.log('parentId', this.state.parentId)  // '614751fc286080320c511c4e'
            this.getCategoryList()  // 获取二级分类列表显示
        })

        // setState()不能立即获取最新的状态: 因为setState()是异步更新状态的
        // console.log('parentId', this.state.parentId)  // '0'
    }

    // 显示一级分类列表
    showCategoryList = ()=>{
        this.setState({  // 更新为显示一级列表的状态
            parentId: '0',
            parentName: '',
            subCategoryList: []
        })
    }


    // 显示添加的确认框
    showAddCategory = ()=>{
        this.setState({
            showStatus: 1
        })
    }
    // 添加分类
    addCategory= ()=>{
        this.addForm.validateFields( async (error, values)=>{  // 进行表单验证, 只有通过了才处理
            console.log(error, values)
            if(!error) {
                this.setState({
                    showStatus: 0  // 隐藏确认框
                })

                // 收集数据, 并提交添加分类的请求
                const { parentId, categoryName } = values
                this.addForm.resetFields()  // 清除输入数据
                const result = await reqAddCategory(parentId, categoryName)
                // console.log(result)
                if(result.status === 0) {
                    if(parentId===this.state.parentId) {  // 添加的分类就是当前分类列表下的分类
                        this.getCategoryList()  // 重新获取当前分类列表显示
                    } else if (parentId==='0'){ // 在二级分类列表下添加一级分类, 重新获取一级分类列表, 但不需要显示一级列表
                        this.getCategoryList('0')
                    }
                }
            } else {
                console.log('addCategory()', error)
            }
        })
    }
    // 响应点击添加分类的取消按钮: 隐藏确定框
    handleAddCancel = ()=>{
        this.addForm.resetFields()  // 清除输入数据
        this.setState({
            showStatus: 0   // 隐藏确认框
        })
    }

    // 显示修改的确认框
    showUpdateCategory= (category)=>{
        this.category = category  // 保存分类对象
        this.setState({
            showStatus: 2
        })
    }
    // 修改分类
    updateCategory= ()=>{
        // console.log('updateCategory')
        this.updateForm.validateFields( async (error, values)=>{  // 进行表单验证, 只有通过了才处理
            // console.log(error, values)
            if(!error) {
                // 1. 隐藏确认框
                this.setState({
                    showStatus: 0
                })

                const categoryId = this.category._id
                const categoryName = values.categoryName
                this.updateForm.resetFields()  // 清除输入数据
                if(this.category.name !== categoryName) {
                    this.category = {}
                    // 2. 发请求更新分类
                    const result = await reqUpdateCategory({categoryId, categoryName})
                    // console.log(result)
                    if(result.status === 0) {
                        // 3. 重新显示列表
                        this.getCategoryList()
                    }
                }
            } else {
                console.log('updateCategory()', error)
            }
        })
    }
    // 响应点击修改分类的取消按钮: 隐藏确定框
    handleUpdateCancel = ()=>{
        this.updateForm.resetFields()  // 清除输入数据
        this.setState({
            showStatus: 0   // 隐藏确认框
        })
    }

    UNSAFE_componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        // 执行异步任务: 发异步ajax请求
        this.getCategoryList()  // 获取一级分类列表显示
    }

    render() {
        const { categoryList, subCategoryList, loading, parentId, parentName, showStatus } = this.state  // 读取状态数据
        const title = parentId==='0' ? '品牌分类管理' : (    // card的左侧
            <span>
                <LinkButton onClick={this.showCategoryList}>品牌列表</LinkButton>
                <Icon type="arrow-right" style={{marginRight: 5}}/>
                <span>{parentName}</span>
            </span>
        )
        const extra = (  // Card的右侧
            <Button type="primary" onClick={this.showAddCategory}>
                <Icon type="plus"/>
                添加
            </Button>
        )

        const category = this.category || {} // 读取指定的分类, 如果还没有指定一个空对象
        return (
            <Card title={title} extra={extra}>
                <Table bordered rowKey="_id" dataSource={ parentId==='0' ? categoryList : subCategoryList }
                       columns={this.columns} loading={loading}
                       pagination={{
                           defaultPageSize: 10, defaultCurrent: 1,
                           showSizeChanger:true, pageSizeOptions: ['5','10','20','40'],
                           showQuickJumper: true
                       }}>
                </Table>

                <Modal title="添加品牌" visible={showStatus === 1} onOk={this.addCategory} onCancel={this.handleAddCancel}>
                    <AddForm categoryList={categoryList} parentId={parentId} setForm={(form) => {this.addForm = form}} />
                </Modal>
                <Modal title="修改品牌" visible={showStatus === 2} onOk={this.updateCategory} onCancel={this.handleUpdateCancel}>
                    <UpdateForm categoryName={category.name} setForm={(form) => {this.updateForm = form}}/>
                </Modal>
            </Card>
        )
    }
}

/*
export default class Category extends Component {
    render() {
        const title = '一级分类列表'  // card的左侧
        const extra = (  // Card的右侧
            <Button type="primary">
                <Icon type="plus"/>
                添加
            </Button>
        )
        const dataSource = [
            {
                "parentId": "0",
                "_id": "614751fc286080320c511c4e",
                "name": "家用电器",
                "__v": 0
            },
            {
                "parentId": "0",
                "_id": "614751fc286080320c511c57",
                "name": "三星",
                "__v": 0
            },
            {
                "parentId": "0",
                "_id": "614751fc286080320c511c4f",
                "name": "手机",
                "__v": 0
            },
        ]
        const columns = [
            {
                title: '分类名称',
                dataIndex: 'name'  // 指定显示数据的属性名
            },
            {
                title: '操作',
                render: () => (  // 返回需要显示的界面标签
                    <span>
                        <LinkButton>修改分类</LinkButton>
                        <LinkButton>查看子分类</LinkButton>
                    </span>
                ),
                width: 300
            }
        ]
        return (
            <Card title={title} extra={extra}>
                <Table bordered rowKey="_id" dataSource={dataSource} columns={columns}></Table>
            </Card>
        )
    }
}
*/
