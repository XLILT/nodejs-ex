var express = require('express');
var passport = require('passport');
var connectEnsureLogin = require('connect-ensure-login');

var router = express.Router();

router.use('/',
	connectEnsureLogin.ensureLoggedIn('/'),
	function(req, res, next) {
	if (req.session.views) {
		req.session.views++;
	}
	else {
		req.session.views = 1;
	}

	res.send("您好，" + req.session.username + "。敬请期待!");
});

module.exports = router;
