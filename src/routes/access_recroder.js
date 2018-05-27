var express = require('express');
var router = express.Router();
var { get_conn } = require('../db');

router.use('/', function(req, res, next) {  
	//if (get_conn && req.headers['x-forwarded-for']) {
  if (get_conn) {
    get_conn().then(conn => {      
      var col = conn.db().collection('access_log');
      //Create a document with request IP and current time of request
      col.insertOne({ip: req.headers['x-forwarded-for'], url: req.originalUrl, refer: req.headers['referer'], date: Date.now()});  
    });    
  };

	next();
});

module.exports = router;
