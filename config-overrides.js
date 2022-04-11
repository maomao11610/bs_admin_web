const {override, fixBabelImports, addLessLoader} = require('customize-cra');
module.exports = override(
    // 针对antd实现按需打包: 根据import来打包(使用babel-plugin-import)
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        // style: 'css',  // 自动打包相关的样式
        style: true,  // 'css'加载编译后的css文件  true会加载less文件
    }),

    // 使用less-loader对源码中的less的变量进行重新指定
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: {'@primary-color': '#1DA57A'},  // 配置全局主题色，默认色是蓝色
    }),
);
