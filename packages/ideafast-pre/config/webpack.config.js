const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
    mode: process.env.NODE_ENV || 'production',
    devtool: process.env.NODE_ENV === 'development' ? 'inline-source-map' : 'source-map',
    entry: (process.env.NODE_ENV === 'development' ?
        {
            core: ['webpack/hot/poll?1000', './src/application']
        } : {
            core: ['./src/application']
        }
    ),
    watch: process.env.NODE_ENV === 'development' ? true : false,
    target: 'web',
    externals: [
        // nodeExternals({
        //     whitelist: ['mcl-wasm'].concat(process.env.NODE_ENV === 'development' ? ['webpack/hot/poll?1000'] : [])
        // }),
        'perf_hooks'
    ],
    module: {
        rules: [
            {
                test: /\.js?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        babelrc: false
                    }
                },
                exclude: /node_modules/
            }
        ]
    },
    plugins: (process.env.NODE_ENV === 'development' ? [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ] : []).concat([
        new webpack.IgnorePlugin(new RegExp('^(fs)$')),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'BUILD_TARGET': JSON.stringify('browser')
            }
        }),
    ]),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'index.js',
        library: process.env.NODE_ENV === 'development' ? undefined : 'ideafast-pre',
        libraryTarget: process.env.NODE_ENV === 'development' ? undefined : 'umd',
        umdNamedDefine: process.env.NODE_ENV === 'development' ? undefined : true
    },
    performance: {
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    }
};