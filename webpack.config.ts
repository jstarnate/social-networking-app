import path from 'path';
import Dotenv from 'dotenv-webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import BrowsersyncPlugin from 'browser-sync-webpack-plugin';

module.exports = {
    entry: {
        index: ['./resources/ts/index.tsx', './resources/sass/index.scss'],
        register: [
            './resources/ts/register.tsx',
            './resources/sass/register.scss',
        ],
        home: ['./resources/ts/home.tsx', './resources/sass/home.scss'],
        forgot: ['./resources/ts/forgot.tsx', './resources/sass/forgot.scss'],
        reset: ['./resources/ts/reset.tsx', './resources/sass/reset.scss'],
    },
    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                [
                                    '@babel/preset-react',
                                    { runtime: 'automatic' },
                                ],
                            ],
                            plugins: ['@babel/plugin-syntax-dynamic-import'],
                        },
                    },
                    'ts-loader',
                ],
                exclude: '/node_modules/',
            },
            {
                test: /\.s(a|c)ss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        alias: {
            pages: path.resolve(__dirname, 'resources/ts/components/pages'),
            helpers: path.resolve(__dirname, 'resources/ts/components/helpers'),
            modules: path.resolve(__dirname, 'resources/ts/components/modules'),
            hooks: path.resolve(__dirname, 'resources/ts/hooks'),
            types: path.resolve(__dirname, 'resources/ts/types'),
            utilities: path.resolve(__dirname, 'resources/ts/utilities'),
            actions: path.resolve(__dirname, 'resources/ts/data/actions.ts'),
        },
    },
    plugins: [
        new Dotenv(),
        new MiniCssExtractPlugin({
            filename: '../css/[name].css',
        }),
        new BrowsersyncPlugin({
            port: 3000,
            open: false,
            notify: false,
            ghostMode: false,
            proxy: 'http://localhost:8000',
        }),
    ],
};
