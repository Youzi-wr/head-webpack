const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ],
    module: {
        rules: [{
            test: /\.scss$/,
            use: [
                MiniCssExtractPlugin.loader,
                "css-loader", // 将 CSS 转化成 CommonJS 模块
                "sass-loader" // 将 Sass 编译成 CSS，默认使用 Node Sass
            ]
        }, {
            test: /\.(png|jpg|gif)$/i,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        // limit: 8192,
                    }
                },
            ],
        }]
    }
};