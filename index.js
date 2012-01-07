module.exports = function(req, res)
{
    //MVC routes
    function routeRequest(req, res)
    {
        var controller = req.params.controller.toLowerCase(),
            action = req.params.action.toLowerCase();
        
        if(! action)
        {
            action = req.params.action = 'index';
            
            if(! controller)
            {
                controller = req.params.controller = 'index';
            }
        }
        
        var filename = __dirname + '/controllers/' + controller + '.js';
    
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
                    return require(__dirname + '/controllers/index.js')[fakeAction.camelCase()](req, res);
                }
                catch(ex)
                {
                    //action was not found in the index controller
                    res.statusCode = 404;
                }
                
                return res.end();
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
            catch(error)
            {
                if(error.type == 'property_not_function')
                {
                    res.statusCode = 404;
                    
                    return res.render('error/404', {
                        error: error
                    });
                }
                else
                {
                    res.statusCode = 500;                
                    
                    return res.render('error/500', {
                        error: error
                    });
                }
            }
        });
    };
    
    app.all('/:controller?/:action?/:params?', routeRequest);
}
