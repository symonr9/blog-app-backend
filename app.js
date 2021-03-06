/***********************************************************************
 * File Name: app.js
 * Description: This file starts and executes the server and its details.
 * Author: Symon Ramos symonr12@gmail.com
 **********************************************************************/

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");

const InitiateMongoServer = require("./config/db");

//Routers, which will define URI endpoints.
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var poetryRouter = require('./routes/poetry');
var proseRouter = require('./routes/prose');
var quotesRouter = require('./routes/quotes');
var wordsRouter = require('./routes/words');
var googleRouter = require('./routes/google');

InitiateMongoServer();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//cors() is needed in order to fix the Access-Control-Allow-Origin
//missing error. 
app.use(cors());
app.use(logger('dev'));
app.use(express.json());

app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'myBlog', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));


//Define URI endpoints here.
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/poetry', poetryRouter);
app.use('/prose', proseRouter);
app.use('/quotes', quotesRouter);
app.use('/words', wordsRouter);
app.use('/google', googleRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
