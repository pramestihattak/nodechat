var Index = require('../routes/index');
var Register = require('../routes/register');
var Login = require('../routes/login');

module.exports = function(app, upload, passport, io) {

	app.get('/', isLoggedIn, Index.home);

	app.get('/login', isGuest, Login.index);
	app.post('/do/login', passport.authenticate('local-login', {
	        successRedirect : '/', // redirect to the secure profile section
	        failureRedirect : '/login', // redirect back to the signup page if there is an error
	        failureFlash : true // allow flash messages
	    }));

	app.get('/register', isGuest, Register.index);
	app.post('/do/register', passport.authenticate('local-signup', {
	        successRedirect : '/', // redirect to the secure profile section
	        failureRedirect : '/register', // redirect back to the signup page if there is an error
	        failureFlash : true // allow flash messages
	    }));


	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/login');
	});

}





// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}

// route middleware to make sure a user is guest
function isGuest(req, res, next) {

	// if user is not authenticated in the session, carry on
	if (req.isUnauthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}