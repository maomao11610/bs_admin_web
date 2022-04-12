/*
 * @Author: your name
 * @Date: 2022-04-11 20:14:26
 * @LastEditTime: 2022-04-12 21:10:34
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \admin-client\src\pages\admin\pages\order\exmaine.jsx
 */
// 卖家发布的内容列表
import React, { Component } from 'react'
import { Tag, Card, Table, Divider, Button, Modal } from 'antd';
import { getExamineList, getExamineDetail,postExamineUpdate } from '../../../../api'
import Content from './content/content'
import './examine.less'

export default class Exmaine extends Component {
    state = {
        data: [],
        total: 0,
        // 是否显示审核框
        isShow: false,
        detail:{},
        saleId:'',
    }

    showStatus(status) {
        // 0:未审核  1：已通过
        if (status === 0) {
            return (<Tag color="red">待审核</Tag>)
        } else if (status === 1) {
            return (<Tag color="lime">已通过</Tag>)
        }
    }
    // 列选项配置
    initColumns = () => {
        this.columns = [

            {
                title: '内容编号',
                dataIndex: 'saleId',
                key: 'saleId',
            },

            {
                title: '车名',
                dataIndex: 'carName',
                key: 'carName',
            },
            {
                title: '地址',
                dataIndex: 'location',
                key: 'location',
            },
            {
                //   按照状态渲染tag
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: this.showStatus
            },
            {
                //   审核按钮
                title: '操作',
                render: (user) => {
                    return (
                        <span>
                            <Button type='primary'
                                onClick={() => this.showExamineModal(user)}>审核</Button>

                        </span>
                    )
                }
            },
        ];
    }
    showExamineModal = async (res) => {
        this.res = res;
       const saleId = res.saleId;
        //   console.log(res);//获得了这一行对应的数据
       const {data}= await getExamineDetail(saleId);
      console.log(data);//要列表展示的数据
        // 查看详情接口能否跑通
     await this.setState({
            isShow: true,
            detail:data,
            saleId:saleId
        })
    }
    handleOk = () => {
        //   审核通过还需要将tag进行更改，调用数据库接口进行update，然后关闭对话框
        console.log(this.state.saleId);
        postExamineUpdate(this.state.saleId);
        this.setState({
            isShow: false
        })
    }
    handleCancle = () => {
        this.setState({
            isShow: false
        })
    }
    getcontentList = async (pageSize, pageNum) => {
        this.pageNum = pageNum;
        this.pageSize = pageSize;
        let result;
        // 请求接口获取列表数据
        result = await getExamineList(pageSize, pageNum);
        if (result.status === 0) {
            //成功
            const { total, list } = result.data;
            this.setState({
                data: list,
                total: total
            })
        }
    }
    UNSAFE_componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getcontentList(1, 5)
    }
    render() {
        console.log(this.state.detail);
        const { data, total, isShow,detail } = this.state
        return (
            <Card>
                <span>内容审核区域</span>
                <Divider />
                <Table rowKey='_id' bordered dataSource={data} columns={this.columns}
                    pagination={{
                        defaultPageSize: 5, defaultCurrent: 1,
                        total: total, current: this.pageNum, pageSize: this.pageSize,
                        showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '40'],
                        onShowSizeChange: this.getcontentList,
                        onChange: this.getcontentList
                    }}
                >
                </Table>
                <Modal title='资料审核单' visible={isShow} onOk={this.handleOk} onCancel={this.handleCancle}><Content detail={detail}></Content ></Modal>
            </Card>
        )
    }
}
