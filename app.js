var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var orm = require('orm');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.use(orm.express('mysql://root:dragon@115.28.234.159:3306/collect', {
	define: function(db, models, next) {
		models.article = db.define("t_article", {
			id : String,
			title : String,
			smalltitle : String,
			image : String,
			originalimage : String,
			content : String,
			author:String,
			writetime: String,
			url:String,
			page:Number,
			catalog_id:String,
			particle_id:String,
			tag:String,
			checkid:String,
			stat:Number,
			createtime:String
		}, {
			methods: {
				getName: function() {
					return this.title;
				}
			}
		});
		next();
	}
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/ding', function(req, res, next) {
	req.models.article.get('0017885b-43c2-4b8e-8a55-970c10283dc2', function(err, article) {
		console.log("We have in" + article.title);
		res.status(200);
	    res.render('index', {
	      title: article.title,
	      content:article.content
	    });
	})
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(8888);

module.exports = app;
