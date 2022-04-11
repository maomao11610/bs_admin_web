/**
 * 进行local数据存储管理的工具模块
 */
import store from 'store'
const USER_KEY = 'user_key'

// eslint-disable-next-line
export default {
    /*
    //原生的localStorage的相关用法
    // 保存user
    saveUser(user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user))
    },

    // 读取user
    getUser() {
        return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
    },

    // 删除user
    removeUser() {
        localStorage.removeItem(USER_KEY)
    }
    */


    // 采用第三方库store, 考虑了兼容性
    // 保存user
    saveUser(user) {
        store.set(USER_KEY, user)
    },

    // 读取user
    getUser() {
        return store.get(USER_KEY) || {}
    },

    // 删除user
    removeUser() {
        store.remove(USER_KEY)
    }

}
