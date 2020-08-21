const path = require("path")
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
module.exports = {
    mode: "production",
    entry: {
        index: path.resolve(__dirname, "./src/index.js")
    },
    devServer: {
        contentBase: path.resolve(__dirname, "./public"),
        port: 9000,
        compress: true
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: ['@babel/plugin-transform-runtime']
                }
            },
            {
                test: /\.scss/,
                use: ['style-loader', {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 2
                    }
                }, 'sass-loader', 'postcss-loader']
            }
        ]
    },
    plugins: [new CleanWebpackPlugin()],
    output: {
        filename: "[name].js",
        library: "breeze",
        libraryTarget: "umd"
    }
}