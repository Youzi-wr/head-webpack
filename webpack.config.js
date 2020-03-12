const path = require('path');
const webpack = require('webpack');

module.exports = env => {
    const isDev = env.NODE_ENV == "development";
    console.log('>>>>env.NODE_ENV', isDev)
    return {
        entry: './src/index.js',
        output: {
            filename: 'common-header.js',
            path: path.resolve(__dirname, '..', 'dist'),
            libraryTarget: 'umd',
            library: 'commonHead'
        },
        optimization: {
            minimize: !isDev,
            // minimize: [
            //     new UglifyJsPlugin({
            //         cache: true,
            //         parallel: true,
            //         uglifyOptions: {
            //             compress: false,
            //             ecma: 6,
            //             mangle: true
            //         },
            //         sourceMap: true
            //     })
            // ]
        },
        module: {
            rules: [{
                test: /\.css$/,
                use: [{
                    loader: 'style-loader' //运行时动态插入style标签到head标签中让CSS代码生效
                }, {
                    loader: 'css-loader'//加载css文件,使得css文件中引用资源模块化
                }]
            }]
        }
    }
};
