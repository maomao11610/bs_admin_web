/**
 * 登录的路由组件
 */
import React, {Component} from 'react'
import { Redirect } from 'react-router-dom'
import { Form, Icon, Input, Button, Checkbox, message } from 'antd'
import './login.less'
import logo from '../../assets/images/logo1.png'

import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

const Item = Form.Item // 不能写在import之前

class Login extends Component {

    // 表单提交事件
    handleSubmit = (event)=>{
        event.preventDefault()  // 阻止事件的默认行为
        // const form = this.props.form  // 得到具强大功能的form对象
        // const values = form.getFieldsValue()  // 手动获取表单项的输入数据
        // console.log('handleSubmit()', values)

        this.props.form.validateFields( async (err, values)=>{  // 对所有表单字段进行统一验证
            if(!err) {  // 检验成功
                // console.log('提交登陆的ajax请求', values)
                const { username, password } = values

                /*reqLogin(username, password).then(response=>{
                    console.warn(response)
                }).catch(error=>{})*/

                // ajax未进行优化时
                /*try {
                    const result = await reqLogin(username, password)
                    console.log(result)
                } catch (error){
                    console.error('请求出错了', error)
                }*/

                // ajax进行了优化
                const result = await reqLogin(username, password)  // {status: 0, data:{}}  {status: 1, msg: 'xxx'}
                // console.log(result)
                if(result.status === 0) {
                    message.success('登陆成功')  // 提示登陆成功

                    const user = result.data
                    memoryUtils.user = user  // 保存在内存中
                    storageUtils.saveUser(user)  // 保存到localStorage中

                    this.props.history.replace('/')  // 跳转到管理界面 (不需要再回退回到登陆)
                } else {
                    message.error(result.msg)  // 提示错误信息
                }

            } else {
                console.error('检验失败!!!')
            }
        })
    }

    // 对密码进行自定义验证
    validatePwd = (rule, value, callback)=>{
        // console.log('validatePwd()', rule, value)
        if(!value) {
            callback('密码不能为空')  // callback('xxx') 验证失败, 并指定提示的文本
        } else if(value.length<4) {
            callback('密码长度不能小于4位')
        } else if(value.length>12) {
            callback('密码长度不能大于12位')
        } else if(!/^[a-zA-Z0-9_]+$/.test(value)) {  // 等价于 !value.match(/^[0-9a-zA-Z_]+$/)
            callback('密码必须是英文、数字或下划线组成')
        } else {
            callback() // 验证通过
        }
    }

    render() {
        const user = memoryUtils.user
        if(user && user._id) {  // 如果用户已经登陆, 自动跳转到管理界面
            return <Redirect to='/'/>
        }

        const form = this.props.form  // 得到具强大功能的form对象
        const { getFieldDecorator } = form

        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>趣摩后台</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Item>
                            {
                                getFieldDecorator('username', { // (标识名称, 配置对象)  配置对象:属性名是特定的一些名称
                                    rules: [
                                        { required: true, whitespace: true, message: '用户名不能为空' },
                                        { min: 4, message: '用户名至少4位' },   // 声明式验证: 直接使用别人定义好的验证规则进行验证
                                        { max: 12, message: '用户名最多12位' },
                                        { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' },
                                    ],
                                    initialValue: 'admin' // 初始值
                                })(
                                    <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                           placeholder="用户名" />
                                )
                            }
                        </Item>
                        <Form.Item>
                            {
                                getFieldDecorator('password', {
                                    rules: [
                                        {
                                            validator: this.validatePwd
                                        }
                                    ]
                                })(
                                    <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                           type="password" placeholder="密码"/>
                                )
                            }
                        </Form.Item>
                        <Form.Item>
                            <Checkbox>记住我</Checkbox>
                            <a className="login-form-forgot" href="/login">忘记密码</a>
                            <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}

const WrapLogin = Form.create()(Login)  // 包装Form组件生成一个新的组件:Form(Login), 新组件会向Form组件传递一个强大的对象属性: form
export default WrapLogin

/*
1. 高阶函数
    1). 一类特别的函数(两种情况)
        a. 接受函数类型的参数
        b. 返回值是函数
    2). 常见
        a. 定时器: setTimeout()/setInterval()
        b. Promise: Promise(() => {}) then(value => {}, reason => {})
        c. 数组遍历相关的方法: forEach()/filter()/map()/reduce()/find()/findIndex()
        d. 函数对象的bind()
        e. Form.create()() / getFieldDecorator()()
    3). 高阶函数更新动态, 更加具有扩展性

2. 高阶组件
    1). 本质就是一个函数
    2). 接收一个组件(被包装组件), 返回一个新的组件(包装组件), 包装组件会向被包装组件传入特定属性
    3). 作用: 扩展组件的功能
    4). 高阶组件也是高阶函数: 接收一个组件函数, 返回是一个新的组件函数

async和await
    1. 作用?
       简化promise对象的使用: 不用再使用then()来指定成功/失败的回调函数
       以同步编码(没有回调函数了)方式实现异步流程
    2. 哪里写await?
        在返回promise的表达式左侧写await: 不想要promise, 想要promise异步执行的成功的value数据
    3. 哪里写async?
        await所在函数(最近的)定义的左侧写async
 */

/*
1.前台表单验证
    用户名/密码的的合法性要求
        1). 必须输入
        2). 必须大于等于4位
        3). 必须小于等于12位
        4). 必须是英文、数字或下划线组成
2.收集表单输入数据

 */






