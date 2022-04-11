/*
 * @Author: your name
 * @Date: 2022-04-11 11:26:41
 * @LastEditTime: 2022-04-11 11:27:43
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \admin-client\src\utils\biansu.js
 */
// 变速箱问题处理
export function transmission(n) {
   if(n===1){
       return '自动挡'
   }else{
       return '手动挡'
   }
  }
  
