
module.exports.index = function(req, res) {
	res.render('index/register', { message: req.flash('registerMessage') });
}
