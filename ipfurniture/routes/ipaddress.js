var ip = require('ip');
exports.ipaddress = function(req, res){
	console.log(ip.address());
	res.render('ipaddress', {
		getip : ip.address()
	});
};