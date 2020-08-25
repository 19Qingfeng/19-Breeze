const {
    merge
} = require("webpack-merge");
const path = require("path")
const common = require("./webpack.base")

const prodConfig = {
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "../dist"),
        library: "breeze",
        libraryTarget: "umd",
    }
}

module.exports = merge(common, prodConfig)