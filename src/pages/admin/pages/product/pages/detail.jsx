/**
 * Product的详情子路由组件
 */
import React, {Component} from 'react'
import { Card, Icon, List } from 'antd'
import LinkButton from '../../../../../components/link-button/LinkButton'
import {BASE_IMG_URL} from '../../../../../utils/constants'
import { reqCategory } from '../../../../../api/index'
import memoryUtils from '../../../../../utils/memoryUtils'
const Item = List.Item

export default class ProductDetail extends Component {
    state = {
        cName1: '', // 一级分类名称
        cName2: '', // 二级分类名称
    }

    async componentDidMount() {
        // BrowserRouter
        // const {pCategoryId, categoryId} = this.props.location.state.product  // 得到当前商品的分类ID
        // HashRouter
        const {pCategoryId, categoryId} = memoryUtils.product

        if(pCategoryId === '0') {
            const result = await reqCategory(categoryId)
            if(result.status === 0) { // 一级分类下的商品
                this.setState({
                    cName1: result.data.name
                })
            }
        } else { // 二级分类下的商品
            /*//通过多个await方式发多个请求: 后面一个请求是在前一个请求成功返回之后才发送，效率较低
            const result1 = await reqCategory(pCategoryId) // 获取一级分类列表
            const result2 = await reqCategory(categoryId) // 获取二级分类
            if(result1.status===0 && result2.status===0) {
                this.setState({
                    cName1: result1.data.name,
                    cName2: result2.data.name
                })
            }*/

            // 一次性发送多个请求, 只有都成功了, 才正常处理
            const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
            // console.log(results)
            const cName1 = results[0].data.name
            const cName2 = results[1].data.name
            this.setState({
                cName1,
                cName2
            })
        }
    }
    // 在卸载之前清除保存的数据
    componentWillUnmount() {
        // HashRouter
        memoryUtils.product = {}
    }

    render() {
        const {cName1 , cName2} = this.state
        // let cName = cName2==='' ? cName1 : cName1+' --> '+cName2

        // BrowserRouter
        // const { name, desc, price, detail, imgs } = this.props.location.state.product
        // HashRouter
        const { name, desc, price, detail, imgs } = memoryUtils.product

        const title= (
            <span>
                <LinkButton>
                    <Icon type="arrow-left" style={{marginRight: 10, fontSize: 16, color:'green'}}
                        onClick={()=>{this.props.history.goBack()}}/>
                </LinkButton>
                <span>商品详情</span>
            </span>
        )

        return (
            <Card title={title} className="product-detail">
                <List>
                    <Item>
                        <span className="left">商品名称:</span>
                        <span>{name}</span>
                    </Item>
                    <Item>
                        <span className="left">商品描述:</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className="left">商品价格:</span>
                        <span>{price}元</span>
                    </Item>
                    <Item>
                        <span className="left">所属分类:</span>
                        {/*<span>{cName}</span>*/}
                        <span>{cName1} {cName2 ? '--> '+cName2 : ''}</span>
                    </Item>
                    <Item>
                        <span className="left">商品图片:</span>
                        <span>
                            {
                                imgs.map((img,index)=><img src={BASE_IMG_URL + img} key={index} alt="商品图片" className="product-img"/>)
                            }
                        </span>
                    </Item>
                    <Item>
                        <span className="left">商品详情:</span>
                        <span dangerouslySetInnerHTML={{__html: detail}}>
                        </span>
                    </Item>
                </List>
            </Card>
        )
    }
}


/*
export default class ProductDetail extends Component {
    render() {
        const title= (
            <span>
                <LinkButton>
                    <Icon type="arrow-left" style={{marginRight: 10, fontSize: 16, color:'green'}}
                          onClick={()=>{this.props.history.goBack()}}/>
                </LinkButton>
                <span>商品详情</span>
            </span>
        )
        return (
            <Card title={title} className="product-detail">
                <List>
                    <Item>
                        <span className="left">商品名称:</span>
                        <span>联想ThinkPad 翼4809</span>
                    </Item>
                    <Item>
                        <span className="left">商品描述:</span>
                        <span>年度重量级新品，X390、T490全新登场 更加轻薄机身设计9</span>
                    </Item>
                    <Item>
                        <span className="left">商品价格:</span>
                        <span>6300元</span>
                    </Item>
                    <Item>
                        <span className="left">所属分类:</span>
                        <span>电脑 --> 笔记本</span>
                    </Item>
                    <Item>
                        <span className="left">商品图片:</span>
                        <span>
                            <img src="/images/computer01.png" alt="" className="product-img"/>
                            <img src="/images/computer02.png" alt="" className="product-img"/>
                        </span>
                    </Item>
                    <Item>
                        <span className="left">商品详情:</span>
                        <span dangerouslySetInnerHTML={{__html:
                                "<span style='color:red;'>15.6英寸家用轻薄便携商务办公手提笔记本电脑 E2-9010/4G/128G固态 2G独显 内置</span>"
                        }}>
                        </span>
                    </Item>
                </List>
            </Card>
        )
    }
}
*/
