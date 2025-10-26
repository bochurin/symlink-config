//@ts-check

'use strict'

const path = require('path')

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

/** @type WebpackConfig */
const extensionConfig = {
  target: 'node', // VS Code extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/
  mode: 'none', // this leaves the source code as close as possible to the original (when packaging we set this to 'production')

  entry: './src/main.ts', // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
  output: {
    // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2'
  },
  externals: {
    vscode: 'commonjs vscode' // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
    // modules added here also need to be added in the .vscodeignore file
  },
  resolve: {
    // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname),
      '@src': path.resolve(__dirname, 'src'),
      '@extension': path.resolve(__dirname, 'src/extension'),
      '@state': path.resolve(__dirname, 'src/state'),
      '@queue': path.resolve(__dirname, 'src/queue'),
      '@commands': path.resolve(__dirname, 'src/commands'),
      '@watchers': path.resolve(__dirname, 'src/watchers'),
      '@managers': path.resolve(__dirname, 'src/managers'),
      '@views': path.resolve(__dirname, 'src/views'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@log': path.resolve(__dirname, 'src/log'),
      '@dialogs': path.resolve(__dirname, 'src/dialogs')
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  },
  devtool: 'nosources-source-map',
  infrastructureLogging: {
    level: 'log' // enables logging required for problem matchers
  }
}
module.exports = [extensionConfig]
