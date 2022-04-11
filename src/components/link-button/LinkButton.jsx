/**
 * 外形像a标签的自定义按钮组件
 */
import React from 'react'
import './index.less'
export default function LinkButton(props) {
    return (
        <button {...props} className="link-button"></button>
    )
}
