const path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode: "production", // "production" | "development" | "none"
    entry: "./src/index.ts", // string | object | array
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
        publicPath: "/assets/",
        library: "checkers",
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader'
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
            },
            {
                test: /\.html$/,
                use: ["html-loader"]
            }
        ]
    },

    resolve: {
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
        contentBase: path.join(__dirname, "dist"),
        port: 9000,
        progress: true
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        }),
        new CheckerPlugin(),
        new ExtractTextPlugin({
            filename: "[name].[contenthash].css",
            disable: process.env.NODE_ENV === "development"
        })
    ],
}   