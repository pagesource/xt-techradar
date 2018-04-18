const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const argv = require('yargs').argv;
// const webpack = require('webpack');

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
        filename: '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        runtimeChunk: {
            name: 'manifest'
        },
        // splitChunks: {
        //     cacheGroups: {
        //         commons: {
        //             test: /(d3|d3-tip|dialog-polyfill)/,
        //             name: 'vendor-1',
        //             chunks: 'initial',
        //         },
        //         vendor: {
        //             test: /(markdow-it|lodash|chance)/,
        //             name: 'vendor-2',
        //             chunks: 'initial',
        //         },
        //     }
        // }
    },
    externals: {
        jquery: 'jQuery'
    },
    devServer: {
        port: 9000,
        contentBase: './dist',
        // Proxy it via myjson api for development
        proxy: {
            '/data': {
                target: 'https://api.myjson.com',
                pathRewrite: {
                    '^/data': '/bins/1gqeib'
                },
                secure: false,
                changeOrigin: true
            }
        }
    },
    module: {
        rules: [{
            enforce: 'pre',
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'eslint-loader',
        }, {
            test: /(\.css|\.scss)$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        ident: 'postcss',
                        plugins: () => [
                            require('postcss-cssnext')(),
                            require('cssnano')()
                        ]
                    }
                }, 'sass-loader']
            })
        }, {
            test: /\.(png|svg|jpg|gif)$/,
            use: ['file-loader']
        }]
    },
    plugins: [
        new ExtractTextPlugin('[name].[chunkhash].css'),
        new CopyWebpackPlugin([{
                from: 'src/docs',
                to: 'docs'
            },
            {
                from: 'src/assets/favicon.ico'
            },
        ]),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            minify: argv.env === 'prod' ? htmlMinifyOptions : false,
            buildTime: (new Date()).toDateString()
        }),
    ],
    mode: argv.env === 'prod' ? 'production' : 'development',
    recordsOutputPath: path.join(__dirname, 'dist', 'records.json')
};