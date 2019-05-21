const router = require('express').Router();
var passport = require('passport');

//Login
router.get('/login',function(req, res){
	res.render('login');
});

//Register
router.get('/register',function(req, res){
	res.render('register');
});



router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('login');
});

//Register
router.get('/webcam',function(req, res){
	res.render('webcam');
});


// auth with google
router.get('/google',passport.authenticate('google', {
	scope:['profile']
}));

//auth with facebook
router.get('/facebook', (req, res) =>{
    // handle with passport
    res.send('logging in with facebook');
});



//callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req,res) => {
	res.send('You have reached the callback URI');
});

module.exports = router;