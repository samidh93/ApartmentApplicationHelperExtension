const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/background.js',
  devtool: 'cheap-module-source-map', // instead of 'eval'
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  target: 'webworker', // target a web worker-like environment

};