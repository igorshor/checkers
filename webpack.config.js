const path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode: "development", // "production" | "development" | "none"
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
                test: /\.worker\.js$/,
                use: { loader: 'worker-loader' }
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                use: "source-map-loader"
            },
            {
                enforce: 'pre',
                test: /\.ts?$/,
                use: "source-map-loader"
            },
            {
                test: /\.ts?$/,
                use: [
                    {
                        loader: 'awesome-typescript-loader',
                        options: {
                            configFileName: 'tsconfig.json'
                        }
                    }
                ],
                exclude: /(?:node_modules)/,
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
        extensions: ['.js', '.ts', '.tsx'],
        modules: [
            "node_modules",
            path.resolve(__dirname, "app")
        ],
    },
    devtool: 'eval',
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