const {
    merge
} = require("webpack-merge");
const path = require("path")
const common = require("./webpack.base")
const HTMlWepbackPlugin = require("html-webpack-plugin")
const {
    CleanWebpackPlugin
} = require("clean-webpack-plugin")



const devConfig = {
    devServer: {
        contentBase: path.resolve(__dirname, "./public"),
        port: 9000,
        compress: true
    },
    devtool: "cheap-module-eval-source-map",
    plugins: [
        new HTMlWepbackPlugin(),
        new CleanWebpackPlugin()
    ]
}

module.exports = merge(common, devConfig)