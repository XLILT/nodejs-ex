var express = require('express');
var passport = require('passport');

var router = express.Router();

var {
  get_conn
} = require('../db');
var {
  crypt_pwd
} = require('./util');

router.use('/',
  passport.authenticate('local'),
  function(req, res, next) {
    if (!req.body.email || !req.body.password_login) {
      return res.sendStatus(400);
    }

    if (get_conn) {
      get_conn().then(conn => {
        var col = conn.db().collection('users');

        col.findOne({
          email: req.body.email
        }).then((result) => {
          var real_passwd = crypt_pwd(req.body.password_login, result.salt);

          if (real_passwd === result.passwd) {
            req.session.username = result.email;

            res.send({
              error: 0
            });
          } else {
            res.send({
              error: '密码错误'
            });
          }
        }, err => {
          res.send({
            error: '数据库查找失败'
          });

          console.error(err);
        });
      }, err => {
        res.send({
          error: '数据库连接失败'
        });

        console.error(err);
      });
    };

  });

module.exports = router;