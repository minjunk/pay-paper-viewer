import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import { spawn } from 'child_process';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { srcDir } from './config/paths';

/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

const { dependencies: externals } = require('./package.json');

const isEnvProduction = process.env.NODE_ENV === 'production';
const isEnvDevelopment = process.env.NODE_ENV === 'development';

const port = Number(process.env.PORT) || 3000;

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
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.node$/,
        use: 'node-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
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
  entry: path.join(srcDir, 'renderer/index.tsx'),
  devtool: isEnvDevelopment ? 'inline-source-map' : false,
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
  module: {
    rules: [
      {
        test: /\.module\.css$/,
        exclude: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              module: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.PORT': JSON.stringify(port),
    }),
    new MiniCssExtractPlugin({
      filename: 'build/renderer.[contenthash].css',
      chunkFilename: 'build/renderer.[contenthash].chunk.css',
    }),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(srcDir, 'renderer/app.html'),
      filename: isEnvProduction ? 'build/app.html' : 'index.html',
    }),
  ],
  node: {
    __dirname: false,
    __filename: false,
  },
});

export default [mainConfig, rendererConfig];
