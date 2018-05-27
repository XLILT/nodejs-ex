var express = require('express');
var router = express.Router();
var { get_conn } = require('../db');
var { crypt_pwd } = require('./util');

router.use('/', function(req, res, next) {
  console.log(req)

  if(!req.body.email || !req.body.password_login) {
    return res.sendStatus(400);
  }

  if (get_conn) {
    get_conn().then(conn => {      
      var col = conn.db().collection('users');
      
      col.findOne({
        email: req.body.email
      }).then((result) => {
        var real_passwd = crypt_pwd(req.body.password_login, result.salt);

        if(real_passwd === result.passwd) {
          res.send({error: 0});  
        }
        else {
          res.send({error: '密码错误！'});
        }
      }, err => {
      	res.send({error: 'db find error'});

      	console.error(err);
      });
    }, err => {
    	res.send({error: "db conn error"});

    	console.error(err);
    });
  };

});

module.exports = router;
