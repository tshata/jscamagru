var express = require('express');
var router = express.Router();

//Get Hompage 
router.get('/',ensureAuthenticated, function(req, res){
	res.render('index');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}else{
		req.flash('error_msg','You need to be logged in to see that page');
		res.redirect('users/login');
	}
}

module.exports = router;