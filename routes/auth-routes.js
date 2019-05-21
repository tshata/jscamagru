const router = require('express').Router();
var passport = require('passport');




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