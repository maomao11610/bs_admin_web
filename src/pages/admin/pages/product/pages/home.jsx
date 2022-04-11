/**
 * Product的默认子路由组件
 */
import React, {Component} from 'react'
import { Card, Select, Input, Button, Table, message } from 'antd'
import LinkButton from '../../../../../components/link-button/LinkButton'
import { reqProductList, reqSearchProductList, reqUpdateStatus } from '../../../../../api/index'
import memoryUtils from '../../../../../utils/memoryUtils'
const Option = Select.Option


export default class ProductHome extends Component {
    state = {
        productList: [], // 商品的数组
        total: 0, // 商品的总数量
        loading: false, // 是否正在加载中
        searchType: 'productName', // 根据哪个字段搜索
        searchName: '', // 搜索的关键字
    }

    // 初始化table的列的数组
    initColumns = ()=>{
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                width: 120,
                title: '价格',
                dataIndex: 'price',
                render: (price)=>'¥'+price  // 当指定了对应的属性时, 传入的是对应的属性值
            },
            {
                width: 160,
                title: '状态',
                // dataIndex: 'status',
                render: (product)=>{   // 当未指定了对应的属性时, 传入的是整行数据
                    const {_id, status} = product
                    const newStatus = status===1 ? 2 : 1
                    return (
                        <span>
                            <span style={{width: 60,display: 'inline-block'}}>{status===1 ? '在售' : '已下架'}</span>
                            <Button type="primary" onClick={()=>this.updateStatus(_id, newStatus)}>
                                {status===1 ? '下架' : '上架'}
                            </Button>
                        </span>
                    )
                }
            },
            {
                width: 120,
                title: '操作',
                render: (product)=>{
                    // BrowserRouter
                    /*return (
                        <span>
                            <LinkButton onClick={()=>this.props.history.push('/product/detail', {product})}>详情</LinkButton>
                            <LinkButton onClick={()=>this.props.history.push('/product/add_update', product)}>修改</LinkButton>
                        </span>
                    )*/

                    // HashRouter
                    return (
                        <span>
                            <LinkButton onClick={()=>this.showDetail(product)}>详情</LinkButton>
                            <LinkButton onClick={()=>this.showUpdate(product)}>修改</LinkButton>
                        </span>
                    )

                }
            },
        ];
    }

    // 显示商品详情界面
    showDetail = (product)=>{  // 缓存product对象 ==> 给detail组件使用
        memoryUtils.product = product
        this.props.history.push('/product/detail')
    }
    // 显示修改商品界面
    showUpdate = (product) => {
        memoryUtils.product = product
        this.props.history.push('/product/add_update')
    }

    // 获取指定页码的列表数据显示
    getProductList = async (pageNum, pageSize)=>{
        this.pageNum = pageNum
        this.pageSize = pageSize
        this.setState({loading: true}) // 显示loading

        const {searchType, searchName} = this.state
        let result
        if(searchName) {  // 如果搜索关键字有值, 说明我们要做搜索分页
            result = await reqSearchProductList({pageNum, pageSize, searchType, searchName })
        } else{  // 一般分页请求
            result = await reqProductList(pageNum, pageSize)
        }

        this.setState({loading: false}) // 隐藏loading
        if(result.status === 0) {
            const { total, list } = result.data
            this.setState({
                total: total,
                productList: list
            })
        }
    }

    // 更新指定商品的状态
    updateStatus = async (productId, status)=>{
        const result = await reqUpdateStatus(productId, status)
        if(result.status===0) {
            message.success('更新商品状态成功')
            this.getProductList(this.pageNum, this.pageSize)
        }
    }

    UNSAFE_componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getProductList(1,5)
    }

    render() {
        const { productList, total, loading, searchType, searchName } = this.state
        const title = (
            <span>
                <Select value={searchType} style={{width:120}} onChange={value=>this.setState({searchType: value})}>
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select>
                <Input placeholder='请输入关键字' style={{width:150, margin:'0 15px'}} value={searchName}
                       onChange={event => this.setState({searchName:event.target.value})}/>
                <Button type="primary" onClick={()=>this.getProductList(1,5)}>搜索</Button>
            </span>
        )
        const extra = (
            <Button type="primary" icon="plus" onClick={()=>this.props.history.push('/product/add_update')}>添加商品</Button>
        )

        return (
            <Card title={title} extra={extra}>
                <Table rowKey='_id' bordered dataSource={productList} columns={this.columns} loading={loading}
                       pagination={{
                           defaultPageSize: 5, defaultCurrent: 1,
                           total: total, current: this.pageNum, pageSize: this.pageSize,
                           showSizeChanger:true, pageSizeOptions: ['5','10','20','40'],
                           showQuickJumper: true,
                           onShowSizeChange: this.getProductList,
                           onChange: this.getProductList
                       }}
                >
                </Table>
            </Card>
        )
    }
}

/*export default class ProductHome extends Component {
    state = {
        productList: [], // 商品的数组
        total: 0, // 商品的总数量
        loading: false, // 是否正在加载中
        searchName: '', // 搜索的关键字
        searchType: 'productName', // 根据哪个字段搜索
        pageNum: 1,   // 当前页号
        pageSize: 5,  // 每页多少条数据
    }

    // 初始化table的列的数组
    initColumns = ()=>{
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                width: 120,
                title: '价格',
                dataIndex: 'price',
                render: (price)=>'¥'+price  // 当指定了对应的属性时, 传入的是对应的属性值
            },
            {
                width: 160,
                title: '状态',
                // dataIndex: 'status',
                render: (product)=>{   // 当未指定了对应的属性时, 传入的是整行数据
                    const {status} = product
                    return (
                        <span>
                            <span style={{width: 60,display: 'inline-block'}}>{status===1 ? '在售' : '已下架'}</span>
                            <Button type="primary">{status===1 ? '下架' : '上架'}</Button>
                        </span>
                    )
                }
            },
            {
                width: 120,
                title: '操作',
                render: (product)=>{
                    return (
                        <span>
                            <LinkButton>详情</LinkButton>
                            <LinkButton>修改</LinkButton>
                        </span>
                    )

                }
            },
        ];
    }

    // 获取指定页码的列表数据显示
    getProductList = async ()=>{
        const { pageNum, pageSize } = this.state
        const result = await reqProductList(pageNum, pageSize)
        if(result.status === 0) {
            const { total, list } = result.data
            this.setState({
                total: total,
                productList: list
            })
        }
    }

    onShowSizeChange = (current, pageSize)=>{
        // console.log(current, pageSize);
        this.setState({
            pageNum: 1,
            pageSize: pageSize
        }, ()=>{
            this.getProductList()
        })
    }
    onChange = (current, pageSize)=>{
        this.setState({
            pageNum: current,
            pageSize: pageSize
        }, ()=>{
            this.getProductList()
        })
    }

    UNSAFE_componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getProductList()
    }

    render() {
        const { productList, total, pageNum, pageSize } = this.state
        const title = (
            <span>
                <Select value="1" style={{width:120}}>
                    <Option value="1">按名称搜索</Option>
                    <Option value="2">按描述搜索</Option>
                </Select>
                <Input placeholder='请输入关键字' style={{width:150, margin:'0 15px'}} />
                <Button type="primary">搜索</Button>
            </span>
        )
        const extra = (
            <Button type="primary" icon="plus">添加商品</Button>
        )

        return (
            <Card title={title} extra={extra}>
                <Table rowKey='_id' bordered dataSource={productList} columns={this.columns}
                       pagination={{
                           defaultPageSize: 5, defaultCurrent: 1,
                           total: total, current: pageNum, pageSize: pageSize,
                           showSizeChanger:true, pageSizeOptions: ['5','10','20','40'],
                           showQuickJumper: true,
                           onShowSizeChange: this.onShowSizeChange,
                           onChange: this.onChange
                       }}
                >
                </Table>
            </Card>
        )
    }
}*/
