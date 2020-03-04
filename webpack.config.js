const path = require('path');
const webpack = require('webpack');
const env = process.env;
console.log(env)
module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd',
        library: 'commonHead'
    },
    optimization: {
        minimize: false,
        // minimizer: [
        //     // we specify a custom UglifyJsPlugin here to get source maps in production
        //     new UglifyJsPlugin({
        //       cache: true,
        //       parallel: true,
        //       uglifyOptions: {
        //         compress: false,
        //         ecma: 6,
        //         mangle: true
        //       },
        //       sourceMap: true
        //     })
        //   ]
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
};