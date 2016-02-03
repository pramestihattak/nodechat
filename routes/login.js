
module.exports.index = function(req, res) {
	res.render('index/login', { message: req.flash('loginMessage') });
}
