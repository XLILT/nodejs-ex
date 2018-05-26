var express = require('express');
var router = express.Router();
var db_cfg = require('../db/config');
var mongodb = require('mongodb').MongoClient;

var db = null,
    dbDetails = new Object();

var initDb = function() {
  if (db_cfg.mongoURL == null) return;

  if (mongodb == null) return;

  mongodb.connect(db_cfg.mongoURL, function(err, conn) {
    if (err) {
      console.log(err)
      return;
    }

    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = db_cfg.mongoURLLabel;
    dbDetails.type = 'MongoDB';

    console.log('Connected to MongoDB at: %s', db_cfg.mongoURL);
  });
};

initDb();

router.use('/', function(req, res, next) {
	if (db && req.headers['x-forwarded-for']) {
    	var col = db.collection('access_log');
    	// Create a document with request IP and current time of request
    	col.insert({ip: req.headers['x-forwarded-for'], url: req.originalUrl, refer: req.headers['referer'], date: Date.now()});
    };

	next();
});

module.exports = router;
