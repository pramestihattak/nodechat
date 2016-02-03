var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');


var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/nodechat');

var app = express();
var http = require('http').Server(app);

var port = process.env.PORT || 8080;

var io = require('socket.io')(http);

//load chat model
var Chat = require('./models/Chat');


//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//logger, cookie parser n body parser setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(flash());

//static path
app.use(express.static(path.join(__dirname, 'public')));


//session
app.use(session({
  secret: 'pramestihattakmantap',
  resave: true,
  saveUninitialized: true
 } ));

//passport
require('./config/passport')(passport); // pass passport for configuration
app.use(passport.initialize());
app.use(passport.session());

//load our routes
require('./http/routes')(app, passport);

//chat api
app.get('/get/chat', function(req, res) {
  Chat.find(function(err, data) {
    if (err) {
      console.log(err);
    }
    res.send(data); 
  }); 
});
app.post('/store/chat', function(req, res) {
  Chat.create({
    fullname: req.body.fullname,
    content: req.body.content
  }, function(err, chat) {
    if (err) {
      res.send(err);
    } else {
      io.emit('chat message', chat);
      //res.send(chat);
    }
  });
});



// error handlers
// development error handler
// will print stacktrace
// export NODE_ENV=development for development
// export NODE_ENV=production for production
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error/error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error/error', {
    message: err.message,
    error: {}
  });
});

//create HTTP server
// launch ======================================================================
http.listen(port);
console.log('The magic happens on port ' + port);
console.log(app.get('env'));
