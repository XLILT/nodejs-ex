'use strict';

const Opn = require('opn');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const db_cfg = require('./src/db/config');

const app = express();
const webpackConfig = require('./webpack_cfg/webpack.dev.js');
const compiler = webpack(webpackConfig);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(compiler, {
	publicPath: webpackConfig.output.publicPath
}));

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password_login'
  },
  function(username, password, done) {
  	//console.log("strategy: ", username, password);

  	return done(null, {'email': username});
  }
));

passport.serializeUser(function(user, done) {
	//console.log('serializeUser', user);

	done(null, user.email);
});

passport.deserializeUser(function(username, done) {	

	done(null, {'email': username});
});

var access_recorder = require('./src/routes/access_recroder');
var register = require('./src/routes/register');
var login = require('./src/routes/login');
var home = require('./src/routes/home');

Object.assign = require('object-assign');

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
//var urlencodedParser = bodyParser.urlencoded({ extended: true })

let session_options = {
	store: new MongoStore({
		url: db_cfg.mongoURL
	}),
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 60000
	}
};

app.use(session(session_options));

app.use(passport.initialize());
app.use(passport.session());

//app.use('/', access_recorder);
app.use(access_recorder);

app.get('/', function(req, res) {
	//console.log(req)
	res.render('index.html');
});

app.post('/register', jsonParser, register);
app.post('/login', jsonParser, login);
//app.get('/home', home);

app.get('/home', function(req, res) {
	//console.log(req)

	res.render('home.ejs', {
		user: {x: 1}
	});
});

//app.use('/', express.static('views'));
//app.use(express.static('views'));

// error handling
app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500).send('Something bad happened!');
});

const devServerOptions = Object.assign({}, webpackConfig.devServer, {
	stats: {
		colors: true
	}
});

const host = devServerOptions.host;
const port = devServerOptions.port;

// Serve the files on port.
app.listen(port, host, () => {
	const url = 'http://' + host + ':' + port;
	const opn_url = 'http://localhost:' + port;

	console.log('Starting server on ' + url);

	Opn(opn_url).then(() => {
		console.log('Already open ' + url);
	})
});