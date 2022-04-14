/*
 * @Author: your name
 * @Date: 2022-04-09 15:12:39
 * @LastEditTime: 2022-04-14 16:09:44
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \admin-client\src\config\menuConfig.js
 */
const menuList = [
  {
    title: '首页', // 菜单标题名称
    key: '/home', // 对应的path
    icon: 'home', // 图标名称
    isPublic: true, // 公开的
  },
  {
    title: '商品管理',
    key: '/products',
    icon: 'appstore',
    children: [ // 子菜单列表
      {
        title: '品牌管理',
        key: '/category',
        icon: 'bars'
      },
      {
        title: '商品管理',
        key: '/product',
        icon: 'tool'
      },
    ]
  },

  {
    title: '用户管理',
    key: '/user',
    icon: 'user'
  },
  {
    title: '角色管理',
    key: '/role',
    icon: 'safety',
  },

  {
    title: '数据统计',
    key: '/charts',
    icon: 'area-chart',
    children: [
      {
        title: '城市销售库存分析',
        key: '/charts/bar',
        icon: 'bar-chart'
      },
      {
        title: '系统年销售分析',
        key: '/charts/line',
        icon: 'line-chart'
      },
      {
        title: '趣摩用户数据分析',
        key: '/charts/pie',
        icon: 'pie-chart'
      },
    ]
  },

  {
    title: '订单管理',
    key: '/order',
    icon: 'windows',
    children:[
      {
        title:'内容审核',
        key:'/order/examine',
        icon:'tool'
    },
      {
        title:'订单列表',
        key:'/order/list',
        icon:'bars'
      }
    ]
  },
]

export default menuList