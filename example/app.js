/**
 * Module dependencies.
 */

var express = require('express'),
    //Express MVC supports arbitrary file extensions
    //for instance: in the line below, you can uncomment the second parameter
    //  if you've written your controllers in coffeescript
    mvc = require('../')(__dirname + '/controllers' /*, 'coffee' */);

var app = module.exports = express.createServer();

// Error Handling

mvc.onError(function(error, req, res) {
  if(error.type == 'property_not_function') {
    res.statusCode = 404;
    
    return res.render('error/404', {
        error: error
    });
  } else {
    res.statusCode = 500;                
    
    return res.render('error/500', {
        error: error
    });
  }
});

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(mvc.middleware);
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
