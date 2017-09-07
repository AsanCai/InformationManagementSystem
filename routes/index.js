var express = require('express');
var router = express.Router();

var model = require('../database/model');
var session = require('./js/session');

var login = require('./login');
var register = require('./register');
var userValidation = require('./userValidation');
var userIndex = require('./userIndex');
var changePassword = require('./changePassword');
var edit = require('./edit');
var submit = require('./submit');




var adminIndex = require('./adminIndex');
var message = require('./message');
var test = require('./test');
var review = require('./review');






/* GET home page. */
router.get('/', function(req, res, next) {
	// if(req.session.admin){
	// 	res.redirect('/adminIndex');
	// } else if(req.session.user){
 //  		res.redirect('/userIndex');
	// } else {
 //  		res.redirect('/login');
	// }
	res.redirect('/login');
});

login(router, model);
register(router, model);
userValidation(router, model);

adminIndex(router, model, session);
userIndex(router, model, session);

changePassword(router, model, session);
edit(router, model, session);
submit(router, model);



message(router, model, session);
review(router, model, session);


test(router, model);


module.exports = router;
