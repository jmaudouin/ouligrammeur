const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'dev.js',
        path: path.resolve(__dirname, '../assets/js'),
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            }
        ],
    }
};