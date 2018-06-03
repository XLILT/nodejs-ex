var express = require('express');
var router = express.Router();
var { get_conn } = require('../db');
var { crypt_pwd } = require('./util');

router.use('/', function(req, res, next) {
	if(!req.body.email || !req.body.password) {
		return res.sendStatus(400);
	}

	if (get_conn) {
    get_conn().then(conn => {
    	var col = conn.db().collection('users');
    	
    	var salt = Math.random().toString().slice(2, 5);
    	col.insertOne({email: req.body.email, passwd: crypt_pwd(req.body.password, salt), salt: salt, active_ts: Date.now(), create_ts: Date.now()}).then(() => {
      	
      	res.send({error: 0});
      }, err => {
      	var err_info = '系统错误';

      	if(err.code === 11000) {
      		err_info = '邮箱重复';
      	}

      	res.send({error: err_info});

      	console.error(err);
      });
    }, err => {
    	res.send({error: "db conn error"});

    	console.error(err);
    });
  };

});

module.exports = router;
