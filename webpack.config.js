const path = require('path');
const webpack = require('webpack');

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
    }
};