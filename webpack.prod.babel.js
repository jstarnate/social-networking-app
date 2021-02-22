import path from 'path';
import glob from 'glob';
import merge from 'webpack-merge';
import { EnvironmentPlugin } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import PurgeCssPlugin from 'purgecss-webpack-plugin';
import config from './webpack.config.babel';

export default merge(config, {
    mode: 'production',
    plugins: [
        new EnvironmentPlugin(['PUSHER_APP_KEY', 'PUSHER_APP_CLUSTER']),
        new MiniCssExtractPlugin({
            filename: '../css/[name].css',
        }),
        new PurgeCssPlugin({
            paths: glob.sync(`${path.join(__dirname, 'resources')}/**/*`, {
                nodir: true,
            }),
        }),
    ],
});
