var express         = require('express');
var app             = express();
var http            = require('http').Server(app);
var io              = require('socket.io')(http);
var dotenv          = require('dotenv').config();
var cors            = require('cors');
var mongoose        = require('mongoose');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var winston         = require('winston');

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '5mb'}));
app.use(cors());
app.use(cookieParser());

// Config session
var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({secret: 'ZFashionSecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

winston.level = process.env.LOG_LEVEL;

app.use(function(err, req, res, next) {
  if (err.name === 'StatusError') {
    res.send(err.status, err.message);
  } else {
    next(err);
  }
});

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
  app.use(errorhandler())
}

app.use(require('./src/router/routes'));

var port = process.env.PORT || 3000;

http.listen(3000, function(req,res){
  console.log('listening on *:3000');
});

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});
