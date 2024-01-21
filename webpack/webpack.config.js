const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
    mode: "production",
    entry: {
        service_worker: path.resolve(__dirname, "..", "src", "service_worker.ts"),
        popup: path.resolve(__dirname, "..", "src", "popup.ts"),
        protector: path.resolve(__dirname, "..", "src", "protector.ts"),
        jira: path.resolve(__dirname, "..", "src", "add-ons", "jira.ts"),
    },
    output: {
        path: path.join(__dirname, "../dist"),
        filename: "[name].js",
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: ".", to: ".", context: "public" }]
        }),
    ],
};