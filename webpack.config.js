const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const argv = require('yargs').argv;
// const webpack = require('webpack');

const htmlMinifyOptions = {
    removeComments: true,
    removeAttributeQuotes: true,
    collapseWhitespace: true
};

const webpackPlugins =  [
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
];

if(argv.env === 'prod') {
    webpackPlugins.push(new UglifyJsPlugin({
        extractComments: true
    }));
}

module.exports = {
    entry: ['babel-polyfill', './src/index.js'],
    output: {
        filename: '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        runtimeChunk: {
            name: 'manifest'
        }
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
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env'],
                plugins: ['@babel/plugin-syntax-dynamic-import']
            }
        }]
    },
    plugins: webpackPlugins,
    mode: argv.env === 'prod' ? 'production' : 'development'
};