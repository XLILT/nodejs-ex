var db_cfg = require('./config');
const { MongoClient } = require('mongodb');

const connectionParams = [
  	db_cfg.mongoURL,
  	{ poolSize: 10 }
]

var get_conn = () => {
  	return MongoClient.connect(...connectionParams);
}

get_conn().then(conn => {
	var col = conn.db().collection('users');
	col.createIndex('email', {
		unique: true
	})
})

module.exports = { 
	get_conn: get_conn	
}
