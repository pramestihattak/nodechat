var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var multer = require('multer');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');


var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/nodechat');

var app = express();
var http = require('http').Server(app);

var port = process.env.PORT || 8080;

var io = require('socket.io')(http);
/*io.on('connection', function(socket) {
  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
  });
});*/

var Chat = require('./models/Chat');






//multer configuration
//destination path
//n
//rename file
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/files/')
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname)
  }
});
var upload = multer({ storage: storage });

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//logger, cookie parser n body parser setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

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
app.use(flash());

//load our routes
require('./http/routes')(app, upload, passport);

app.post('/store/chat', function(req, res) {
  Chat.create({
    username: req.body.username,
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
