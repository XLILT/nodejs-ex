var express = require('express');
var router = express.Router();

router.use('/', function(req, res, next) {  
	res.send("敬请期待！");
});

module.exports = router;
