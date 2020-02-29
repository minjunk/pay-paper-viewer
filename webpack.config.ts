import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import { spawn } from 'child_process';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { srcDir } from './config/paths';

const isEnvProduction = process.env.NODE_ENV === 'production';
const isEnvDevelopment = process.env.NODE_ENV === 'development';

const pkg = fs.readFileSync(path.join(__dirname, 'package.json'));
const { dependencies: externals } = JSON.parse(pkg.toString());

const port = Number(process.env.PORT) || 3000;

/* eslint-disable no-nested-ternary */

const baseConfig: webpack.Configuration = {
  mode: isEnvProduction ? 'production'
    : isEnvDevelopment ? 'development' : 'none',
  output: {
    path: __dirname,
    libraryTarget: 'commonjs2',
  },
  externals: [...Object.keys(externals || {})],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.node$/,
        use: 'node-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'build/[contenthash].css',
      chunkFilename: 'build/[contenthash].chunk.css',
    }),
  ],
};

const mainConfig: webpack.Configuration = merge(baseConfig, {
  name: 'main',
  entry: path.join(srcDir, 'main/index.ts'),
  output: {
    filename: 'main.js',
    chunkFilename: 'build/main.[hash].chunk.js',
  },
  target: 'electron-main',
});

const rendererConfig: webpack.Configuration = merge(baseConfig, {
  name: 'renderer',
  target: 'electron-renderer',
  entry: [
    path.join(srcDir, 'renderer/index.ts'),
    path.join(srcDir, 'renderer/app.css'),
  ],
  devtool: 'inline-source-map',
  output: {
    filename: 'build/renderer.[hash].js',
    chunkFilename: 'build/renderer.[hash].chunk.js',
  },
  devServer: {
    port,
    compress: true,
    noInfo: true,
    stats: 'errors-only',
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    before(): void {
      spawn('yarn', ['run', 'dev:main'], {
        shell: true,
        env: process.env,
        stdio: 'inherit',
      })
        .on('close', (code) => process.exit(code))
        .on('error', (spawnError) => console.error(spawnError));
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.PORT': JSON.stringify(port),
    }),
    new HtmlWebpackPlugin({
      template: path.join(srcDir, 'renderer/app.html'),
      filename: 'build/app.html',
    }),
  ],
  node: {
    __dirname: false,
    __filename: false,
  },
});

export default [mainConfig, rendererConfig];
