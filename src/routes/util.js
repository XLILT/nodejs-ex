var crypto = require('crypto');

function crypt_pwd(password, salt) {    	
    var saltPassword = password + ':' + salt;
    var md5 = crypto.createHash('md5');
    
    return md5.update(saltPassword).digest('hex');
}

module.exports = {
	crypt_pwd: crypt_pwd
}