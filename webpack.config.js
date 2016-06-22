var webpack = require("webpack");
var path = require('path');
var DEV = process.env.NODE_ENV !== 'production';
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    entry: {
        app: "./src/js/app.tsx",
    },
    cache: true,
    output: {
        path:  path.resolve(__dirname, 'public'),
        //filename: DEV ? "[name].js" : "[name].[hash].js"
        filename: DEV ? "[name].js" : "[name].js"
    },
    debug: DEV,
    devtool: DEV ? "source-map" : null,
    module: {
        loaders: [
            { test: /\.tsx?$/, loader: "babel!ts-loader" },
             {
                test: /\.(scss|css)$/,
                loader: ExtractTextPlugin.extract(
                    // activate source maps via loader query
                    'css?sourceMap!' +
                    'sass?sourceMap' +
                    'scss?sourceMap'
            )
            }, {
                test: /\.json$/, loader: "json-loader"
            }, , {
                test: /\.(svg|woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,    loader: "file?name=[name].[ext]"
            },
        ],
        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { test: /\.js$/, loader: "source-map-loader" }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
         { from: 'src/static', to: './' },
         ]),
        //new ExtractTextPlugin(DEV ? '[name].css' : '[name].[hash].css'),
        new ExtractTextPlugin(DEV ? '[name].css' : '[name].css'),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en-nz/),
        new webpack.optimize.DedupePlugin(),
        function() {
            if(!DEV){
                this.plugin("done", function(stats) {
                  require("fs").writeFileSync(
                    path.join(__dirname, "stats.json"),
                    JSON.stringify(stats.toJson().assetsByChunkName));
                });
            }
        },
        !DEV ? new CleanWebpackPlugin(['public'], {
          verbose: true,
          dry: false
        }) : function() {},
       // new webpack.optimize.UglifyJsPlugin(),
    ]
}