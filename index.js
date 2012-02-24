module.exports = function(controller_dir)
{
    var fs = require('fs'),
        dir = controller_dir,
        handleError = function(err, req, res) {
          throw err;
        };
    
    //add slash to controller dir
    if(dir.charAt(dir.length-1) != '/') dir += '/';
    
    //MVC routes
    function routeRequest(req, res)
    {
        var controller = req.params.controller,
            action = req.params.action;
        
        if(! action)
        {
            action = req.params.action = 'index';
            
            if(! controller)
            {
                controller = req.params.controller = 'index';
            }
        }
        
        action = action.toLowerCase();
        controller = controller.toLowerCase();
        
        var filename = dir + controller + '.js';

        fs.stat(filename, function(err, stats)
        {
            String.prototype.camelCase = function()
            {
                return this.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});
            };
            
            //if there are errors
            if(err)
            {
                try
                {
                    //see if the req.params.controller name exists as an action in the index controller
                    action = req.params.action = controller;
                    controller = req.params.controller = 'index';
                    var fakeAction = req.method.toLowerCase() + '-' + action;
                    return require(dir + 'index.js')[fakeAction.camelCase()](req, res);
                }
                catch(ex)
                {
                    //action was not found in the index controller
                    return handleError(ex, req, res);
                }
            }
            
            //prepend the request method to the action name
            action = req.method.toLowerCase() + '-' + action;
            
            //do a controller-level preDispatch
            var flag = true;
            try { flag = require(filename).pre(req, res); } catch(ignore) { /* ignore it if it doesn't exist */ }
            
            //execute the requested method
            try
            {
                if(flag)
                    require(filename)[action.camelCase()](req, res);
            }
            catch(ex)
            {
                handleError(ex, req, res);
            }
        });
    };
    
    return {
        middleware: function(req, res, next)
        {
            req.app.all('/:controller?/:action?/:params?', routeRequest);
            
            next();
        },
        onError: function(newHandler)
        {
            handleError = newHandler;
        }
    }
}
