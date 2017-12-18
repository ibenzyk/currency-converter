const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack  = require("webpack");
const helpers = require('./helpers');

module.exports = {
  entry: {
    polyfills: "./src/polyfills.ts",
    vendor: "./src/vendor.ts",
    main: "./src/main.ts", // bundle's entry point
  },
  
  resolve: {
    extensions: ['.js', '.ts'],
    modules: [
      helpers.root('node_modules')
    ],
  },

  output: {
    path: path.resolve(__dirname, 'dist'), // output directory
    filename: "[name].js" // name of the generated bundle
  },
  
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "awesome-typescript-loader"
      },
      {
        test: /\.ts$/,
        enforce: "pre",
        loader: 'tslint-loader'
      },
      {
        test: /\.css$/,
        loader: ["style-loader","css-loader"]
      },
      {
        test: /\.scss$/,
        include: helpers.root('src', 'app'),
        loader: ["exports-loader?module.exports.toString()","css-loader?sourceMap","sass-loader?sourceMap"]
      },
      {
        test: /\.html$/,
        loader: "html-loader"
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file-loader'
      },
    ]
  },

  plugins: [

    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)@angular/,
      helpers.root('./src'), // location of your src
      {} // a map of your routes
    ),
    
    new HtmlWebpackPlugin({
      template: "src/index.html",
      inject : "body"
    }),
    
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills']
    }),

  ],

  devtool: "source-map",
  devServer: {
    historyApiFallback: true
  },

};
