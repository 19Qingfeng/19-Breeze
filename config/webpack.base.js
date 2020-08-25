const path = require("path")
const VueLoaderPlugin = require('vue-loader/lib/plugin')
module.exports = {
    entry: {
        main: path.resolve(__dirname, "../src/index.js")
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
    plugins: [
        new VueLoaderPlugin()
    ],
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "../dist")
    }
}