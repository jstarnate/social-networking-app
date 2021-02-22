import merge from 'webpack-merge';
import Dotenv from 'dotenv-webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import BrowserSyncPlugin from 'browser-sync-webpack-plugin';
import config from './webpack.config.babel';

export default merge(config, {
    mode: 'development',
    watch: true,
    plugins: [
        new Dotenv(),
        new MiniCssExtractPlugin({
            filename: '../css/[name].css',
        }),
        new BrowserSyncPlugin({
            port: 3000,
            open: false,
            notify: false,
            ghostMode: false,
            proxy: {
                target: 'http://localhost:8000',
                ws: true,
            },
        }),
    ],
});
