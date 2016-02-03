var Chat = require('../models/Chat');


module.exports.home = function(req, res) {
	res.render('index/home', {userAuth: req.user});
}
