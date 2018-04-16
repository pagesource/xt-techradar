const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const argv = require('yargs').argv;
const webpack = require('webpack');

const htmlMinifyOptions = {
    removeComments: true,
    removeAttributeQuotes: true,
    collapseWhitespace: true
};

module.exports = {
    entry: {
        'index': './src/index.js'
    },
    output: {
        filename: '[chunkhash].bundle.js',
        chunkFilename: "[chunkhash].bundle.js",
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        runtimeChunk: {
            name: "manifest"
        },
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    priority: -20,
                    chunks: "all"
                }
            }
        }
   },
    externals: {
        jquery: 'jQuery'
    },
    devServer: {
        contentBase: './dist'
    },
    module: {
        rules: [{
            test: /(\.css|\.scss)$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', 'sass-loader']
            })
        }, {
            test: /\.(png|svg|jpg|gif)$/,
            use: ['file-loader']
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            title: 'XT | Tech Radar',
            minify: argv.env === 'prod' ? htmlMinifyOptions : false
        }),
        new ExtractTextPlugin('[chunkhash].bundle.css'),
        new CopyWebpackPlugin([
            {from: 'src/docs', to: 'docs'},
            {from: 'src/assets/favicon.ico'},
        ])
    ],
    mode: argv.env === 'prod' ? 'production' : 'development'
};