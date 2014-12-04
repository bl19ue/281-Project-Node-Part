var ipaddress = require('./routes/ipaddress');
var MongoClient = require('mongodb').MongoClient;

var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');
var users = require('./routes/user');

var app = express();

// view engine setup
app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

app.get('/', routes.index);
app.get('/users', users.list);
app.get('/ipaddress', getIPAddress);
app.get('/furniture', getAFurniture);
app.get('/furniture/:name', getFurniture);


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});

var ip = require('ip');
function getIPAddress(req, res){
	console.log(ip.address());
	res.render('ipaddress', {
		getip : ip.address()
	});
};

function getAFurniture(req, res){
	MongoClient.connect("mongodb://localhost:27017/exampleDB", function(err, db){
		if(err)
			console.log(err);

		db.collection("test").find({}, {'name': true}).toArray(function(err, results) {
			/*
			for(var result in results){
				console.log(results[result].name);
			}
			*/
			//console.log(results[0].name);
			res.render('furniture', {
				getresults : results
			});
			
			console.dir(results);
		});
	});
};

function getFurniture(req, res){
	MongoClient.connect("mongodb://localhost:27017/exampleDB", function(err, db){
		if(err)
			console.log(err);

		var got_name = req.param("name");
		
		db.collection("test").find({'name': got_name}, {'name': true}).toArray(function(err, results) {
			console.log(results);
			res.render('furniture', {
				getresults : results
			});
			
			console.dir(results);
		});
	});
};


module.exports = app;
