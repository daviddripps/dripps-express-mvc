# Dripps's Express MVC

Yet another approach to MVC in Express.  Coming from a PHP/Zend background, the conventions used here seem more intuitive to me than the other options I uncovered while building [Netmarks](http://www.mynetmarks.com "Netmarks").

## Installation

``` bash
npm install dripps-express-mvc
```

## Application Structure

```
example_app
   app.js
   controllers
     index.js
   node_modules
   package.json
   public
   views
     error
       404.jade
       500.jade
     index
       index.jade
 ```

see the example directory for more information.

## Usage

After installing the NPM package we need to add it to Express.  Place the following in your app.js after your configuration (including ```app.use(app.router)```) and any custom routes you may have specified.  In practice, this line usually immediately precedes ```app.listen(port)```.

``` javascript
require('dripps-express-mvc')(req, res);
```

### Naming Controllers
Controller names represent the first section of the url path.  They are alphanumeric and completely lowercase.

For example: Requests to any of the following urls would be routed to APPLICATION_PATH/controllers/user.js

*    http://www.example.com/user

*    http://www.example.com/User

*    http://www.example.com/USER

### Naming Controller Methods
Controller methods are named based on the request method and the action name.  The action name is the second portion of the url path immediately following the controller name and separated by a forward slash (/).  The request method is prepended to the action name and the entire string in camelCased based on the URL Formatting guidelines below.  Due to the camelCasing all characters except the first character of each word are converted to lowercase.

For example: a GET request to "/user/login" would be routed to the getLogin() method in the user.js controller.

Note: requests to a naked controller name are routed assuming an action name of "index" and based on the same guidelines as above.  So a PUT request to "/user" would be routed to the putIndex() method of the user.js controller.

### The preDispatch method
A special method is provided for controller-level processing for each request.  If implemented, this method must return a value equating to either ```true``` or ```false``` indicating whether the request should continue onto the controller method being requested.

A common use of the preDispatch method is for authenticating a user prior for all methods of the controller or checking ACL rules for an admin section.

### Additional Parameters
Additional parameters are derived from any portions of the url path following the action name.  They are supplied in pairs with a forward slash (/) separating the key and value as well as key/value pairs.  They are exposed as an object to your methods via ```req.params.params```.

For example: the following endpoint would provide a value of ```1``` for ```req.params.params.id```: "/user/show/id/1"

### URL Formatting

#### Dashes (-)
Dashes are removed and the following letter is capitalized to camelCase that portion of the URL

For example: the controller method for a POST request to endpoint "/user/add-netmarks-pod" would reside in APPLICATION_PATH/controllers/user.js and be named postAddNetmarksPod

#### Underscores (_)
Underscores are left as is so be cautious when naming your controllers and methods if you anticipate an underscore

For example: the controller method for a POST request to endpoint "/user/add_netmarks_pod" would reside in APPLICATION_PATH/controllers/user.js and be named postAdd_netmarks_pod

### Error Pages

Views for error pages are to be named after their HTTP Response Code and placed in the "error" subdirectory of the application's views directory.  See the Application Structure section above for more information.

## Tests

Tests are coming.
