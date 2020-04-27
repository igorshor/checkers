const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
        publicPath: "/assets/",
        library: "checkers",
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.worker\.js$/,
                loader: 'worker-loader'
            },
            {
                test: /\.(ts|tsx)$/,
                loader: 'ts-loader',
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader", options: {
                        sourceMap: true
                    }
                }, {
                    loader: "sass-loader", options: {
                        sourceMap: true
                    }
                }]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json', '.ts', '.tsx'],
        modules: [
            "node_modules",
            path.resolve(__dirname, "app")
        ],
    },
    performance: {
        hints: "warning", // enum
        maxAssetSize: 200000, // int (in bytes),
        maxEntrypointSize: 400000, // int (in bytes)
        assetFilter: function (assetFilename) {
            return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
        }
    },
    devServer: {
        contentBase: path.join(__dirname, "src"),
        port: 9000,
        progress: true
    },

    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: "./src/index.html"
        }),
        new ExtractTextPlugin({
            filename: "[name].[contenthash].css",
            disable: process.env.NODE_ENV === "development"
        })
    ],
}   