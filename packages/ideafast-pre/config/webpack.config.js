const webpack = require('webpack');
const path = require('path');

module.exports = {
    mode: process.env.NODE_ENV || 'production',
    devtool: process.env.NODE_ENV === 'development' ? 'inline-source-map' : 'source-map',
    entry: {
        core: ['./src/pf-pre']
    },
    watch: process.env.NODE_ENV === 'development' ? true : false,
    target: 'web',
    resolve: {
        extensions: ['.js', '.json', '.wasm']
    },
    module: {
        noParse: /mcl-wasm\/test\.js/,
        rules: [
            {
                test: /\.wasm$/,
                type: 'javascript/auto',
                use: {
                    loader: 'arraybuffer-loader'
                }
            },
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
        new webpack.NamedModulesPlugin()
    ] : []).concat([
        new webpack.IgnorePlugin(new RegExp('^(fs|perf_hooks)$')),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'BUILD_TARGET': JSON.stringify('browser')
            }
        }),
    ]),
    output: {
        path: path.join(__dirname, '../dist'),
        filename: 'index.js',
        library: 'ideafast-pre',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        webassemblyModuleFilename: "[hash].wasm"
    },
    performance: {
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    }
};