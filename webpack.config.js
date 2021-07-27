const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const mode = process.env.NODE_ENV || "development"

module.exports = {
    mode: mode,
    entry: path.join(__dirname, "src", "index.js"),
    output: { 
        path: path.join(__dirname, "build"), 
        filename: "index.bundle.js" 
    },
    resolve: { 
        modules: [
            path.resolve(__dirname, "src"), "node_modules"
        ] 
    },
    devServer: { 
        contentBase: path.join(__dirname, "src"),
        before(app) {
            app.use((req, res, next) => {
                res.header('Cross-Origin-Opener-Policy', 'same-origin');
                res.header('Cross-Origin-Embedder-Policy', 'require-corp');
                next();
            });
        },
        open: true,
    },
    module: {
        rules: [
            { 
                test: /\.(js|jsx)$/, 
                exclude: /node_modules/, 
                use: ["babel-loader"] 
            },
            {
                test: /\.(css|scss)$/,
                use: ["style-loader", "css-loader"],
            },
            { 
                test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
                use: ["file-loader"] 
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "index.html"),
        }),
    ],
    devtool: 'source-map'
};