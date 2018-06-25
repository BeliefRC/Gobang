const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: "./src/js/script.js",
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: "js/[name].bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                include: path.resolve(__dirname, "src"),
                exclude: path.resolve(__dirname, 'node_modules'),
                options: {
                    presets: ['latest']
                }
            },
            {
                test: /\.html$/,
                loader: "html-loader"
            },
            {
                test: /\.css$/,
                include: path.resolve(__dirname, "src"),
                exclude: path.resolve(__dirname, 'node_modules'),
                loader: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 100,
                            name: 'assets/[name].[ext]'
                        }
                    },
                    {loader: "image-webpack-loader"}
                ]
            },
        ]
    },
    plugins: [
        new htmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: 'body'
        }),
    ]
};