'use strict';

const Opn = require('opn');
const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack_cfg/webpack.dev.js');

const compiler = Webpack(webpackConfig);
const devServerOptions = Object.assign({}, webpackConfig.devServer, {
	stats: {
		colors: true
	}
});

const server = new WebpackDevServer(compiler, devServerOptions);

const host = devServerOptions.host;
const port = devServerOptions.port;

server.listen(port, host, () => {
	const url = 'http://' + host + ':' + port;
	const opn_url = 'http://localhost:' + port;

	console.log('Starting server on ' + url);

	Opn(opn_url).then(() => {
		console.log('Already open ' + url);
	})
 });
