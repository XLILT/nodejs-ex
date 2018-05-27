//  OpenShift sample Node application
var express = require('express'),
    app     = express(),
    morgan  = require('morgan');

var bodyParser = require('body-parser')

var access_recorder = require('./src/routes/access_recroder');
var register = require('./src/routes/register');
var login = require('./src/routes/login');
var home = require('./src/routes/home');

Object.assign=require('object-assign');

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';    

// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: true })

app.use('/', access_recorder);

app.use('/', express.static('views'));

app.get('/', function (req, res) {
  res.render('index.html');
});

app.post('/register', jsonParser, register);
app.post('/login', jsonParser, login);
app.get('/home', home);

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
