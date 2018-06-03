var express = require('express');
var passport = require('passport');
var connectEnsureLogin = require('connect-ensure-login');

var router = express.Router();

router.use('/',
	connectEnsureLogin.ensureLoggedIn('/'),
	function(req, res) {
		res.render('home.ejs', {
			user: req.session.username
		});
	}
);

module.exports = router;