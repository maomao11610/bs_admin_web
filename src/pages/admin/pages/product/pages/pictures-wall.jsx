/**
 * 用于图片上传的组件
 */
import React, {Component} from 'react'
import {Icon, Upload, Modal, message} from 'antd'
import PropTypes from 'prop-types'
import { reqDeleteImg } from '../../../../../api/index'
import { BASE_IMG_URL } from '../../../../../utils/constants'

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default class PicturesWall extends Component {
    /*state = {
        previewVisible: false, // 标识是否显示大图预览Modal
        previewImage: '', // 大图的url
        fileList: [  // 图片列表
            /!*{
                uid: '-1', // 每个file都有自己唯一的id
                name: 'image.png', // 图片文件名
                status: 'done', // 图片状态: done已上传, uploading: 正在上传中, removed: 已删除, error: 上传错误
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png', // 图片地址
            },
            {
                uid: '-2',
                name: 'image.png',
                status: 'error',
            },*!/
        ],
    }*/

    static propTypes = {
        imgs: PropTypes.array.isRequired
    }

    constructor(props) {
        super(props)

        let fileList = []
        const {imgs} = props // 如果传入了imgs属性
        if(imgs && imgs.length>0){
            fileList = imgs.map((img,index)=>({
                uid: -index,
                name: img,
                url: BASE_IMG_URL + img,
                status: 'done'
            }))
        }

        this.state = {  // 初始化状态
            previewVisible: false, // 标识是否显示大图预览Modal
            previewImage: '', // 大图的url
            fileList,  // 图片列表
        }
    }

    // 隐藏Modal
    handleCancel = () => this.setState({ previewVisible: false });

    // 图片预览
    handlePreview = async file => {
        // console.log('handlePreview()',file)
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    // 上传文件改变时  file: 当前操作的图片文件(上传/删除)  fileList: 所有已上传图片文件对象的数组
    handleChange = async ({ file, fileList }) => {
        // console.log('handleChange()', file, fileList, file===fileList[fileList.length-1])
        if(file.status==='done') {  // 一旦上传成功, 将当前上传的file的信息修正(name, url)
            const result= file.response
            // console.log(result)  // {status: 0, data: {name: 'xxx.jpg', url: '图片地址'}}

            if(result.status===0) {
                message.success('上传图片成功!')
                const { name, url } = result.data
                file = fileList[fileList.length-1]
                file.name = name
                file.url = url
                // console.log(file)
            } else {
                message.error('上传图片失败!')
            }
        } else if(file.status==='removed') { // 删除图片
            const result= await reqDeleteImg(file.name)
            if(result.status===0) {
                message.success('删除图片成功!')
            } else {
                message.error('删除图片失败!')
            }
        }


        this.setState({ fileList })  // 在操作(上传/删除)过程中更新fileList状态
    };

    // 获取所有已上传图片文件名的数组
    getImgList = ()=>{
        return this.state.fileList.map(file=>file.name)
    }

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        )
        return (
            <div>
                <Upload
                    action="/manage/img/upload"  /*上传图片的接口地址*/
                    accept='image/*'  /*只接收图片格式*/
                    name='image'  /*发给后台接口的请求参数名*/
                    listType="picture-card"  /*卡片样式*/
                    fileList={fileList}  /*所有已上传图片文件对象的数组*/
                    onPreview={this.handlePreview}  /*点击文件链接或预览图标时的回调*/
                    onChange={this.handleChange}  /*上传文件改变时的状态*/
                >
                    {fileList.length >= 4 ? null : uploadButton}
                </Upload>

                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="图片预览" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        )
    }
}
