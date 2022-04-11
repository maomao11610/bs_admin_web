/**
 * 包含n个日期时间处理的工具函数模块
 */

// 格式化日期
export function formatDate(time) {
  if (!time) return ''
  let date = new Date(time)
  let Y = date.getFullYear()
  let M = (date.getMonth() + 1 + '').padStart(2, '0')
  let D = (date.getDate() + '').padStart(2, '0')
  let hh = (date.getHours() + '').padStart(2, '0')
  let mm = (date.getMinutes() + '').padStart(2, '0')
  let ss = (date.getSeconds() + '').padStart(2, '0')

  return Y + '-' + M + '-' + D + ' ' + hh + ':' + mm + ':' + ss
}
