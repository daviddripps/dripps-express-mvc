module.exports = function(controller_dir, file_extension) {
  var fs = require('fs'),
      dir = controller_dir,
      ext = file_extension || 'js',
      handleError = function(err, req, res) {
        throw err;
      };
  
  //add a convenience method to the String prototype for camelCasing the actions
  String.prototype.camelCase = function() {
    return this.replace(/(\-[a-z])/g, function($1){ return $1.toUpperCase().replace('-',''); });
  };
  
  //add slash to controller dir
  if(dir.charAt(dir.length-1) != '/') dir += '/';
  //remove prepending periods from the file extension
  ext = ext.replace(/^\.+/,'');
  
  //MVC routes
  function routeRequest(req, res) {
    var controller = req.params.controller,
        action = req.params.action,
        filename,       //controller filename
        flag = true;    //preDispatch flag
    
    if(! action) {
      action = req.params.action = 'index';
      
      if(! controller) controller = req.params.controller = 'index';
    }
    
    action = action.toLowerCase();
    controller = controller.toLowerCase();
    filename = dir + controller + '.' + ext;
    
    fs.stat(filename, function(err, stats) {      
      //if there are errors
      if(err) {
        try {
          //see if the req.params.controller name exists as an action in the index controller
          action = req.params.action = controller;
          controller = req.params.controller = 'index';
          
          var controllerObject = require(dir + 'index.js'),
              fakeAction = (req.method.toLowerCase() + '-' + action).camelCase();
          
          if(typeof controllerObject[fakeAction] != 'function')
            return res.send(404);
          
          return require(dir + 'index.js')[fakeAction](req, res);
        } catch(ex) {
          //action was not found in the index controller
          return handleError(ex, req, res);
        }
      }
      
      //prepend the request method to the action name
      action = req.method.toLowerCase() + '-' + action;
      
      //do a controller-level preDispatch
      try { flag = require(filename).pre(req, res); } catch(ex) { /* ignore if doesn't exist */ }
      
      //execute the requested method
      try {
        if(flag)
          require(filename)[action.camelCase()](req, res);
      } catch(ex) {
        handleError(ex, req, res);
      }
    });
  };
  
  return {
    middleware: function(req, res, next) {
      req.app.all('/:controller?/:action?/:params?', routeRequest);
      
      next();
    },
    onError: function(newHandler) {
      handleError = newHandler;
    }
  }
}
