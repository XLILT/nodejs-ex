'use strict';

const express = require('express')
//const proxy = require('express-http-proxy');
//const rewrite = require('express-urlrewrite');

const webpackConfig = require('./webpack_cfg/webpack.dev.js');

const app = express()

app.use('/', express.static('dist'))
//app.use('/test_proxy', rewrite('/^test_proxy', '/'), proxy('https://www.baidu.com'))
 
const host = webpackConfig.devServer.host;
const port = webpackConfig.devServer.port;
// Listen
app.listen(port, host, () => {
	const url = 'http://' + host + ':' + port;

	console.log('Starting server on ' + url);
})
