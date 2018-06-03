var crypto = require('crypto');

function crypto_md5(plaintext) {    
    var md5 = crypto.createHash('md5');
    
    return md5.update(plaintext).digest('hex');
}

module.exports = {
	crypto_md5: crypto_md5
}