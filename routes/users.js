var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth20');
var WeThinkCodeStrategy = require('passport-42').Strategy;
var User = require('../models/user');
const keys = require('../config/keys');

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
// Register User
router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			  errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});

//Serialize and Deserialize
passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id).then((user) => {
		done(null, user);
	});
});

//local Strategy 
passport.use(new LocalStrategy(
  function(username, password, done) {
	User.getUserByUsername(username, function(err, user){
		if(err) throw err;
		if(!user){
			return done(null, false, {message: 'Unknown User'});
		}
	User.comparePassword(password, user.password, function(err, isMatch){
		if(err) throw err;
		if(isMatch){
			return done(null, user);
		}else{
			return done(null, false, {message: 'Invalid password'});
		}
	});
	});
  }));

//Google Strategy
passport.use(
	new GoogleStrategy({
		//options for the google strat
		callbackURL:'/auth/google/redirect',
		clientID:keys.google.clientID,
		clientSecret:keys.google.clientSecret 
	}, (accessToken, refreshToken,profile,done) => {
	//passport callback function
		User.findOne({googleId: profile.id}).then((currentUser) => {
			if(currentUser){
				//if we already have this user
				console.log('user is:' + currentUser);
				done(null, currentUser);
			}
			else
			{
				new User({
				username:profile.displayName,
				googleId: profile.id
				}).save().then((newUser) => {
				console.log('new user created: ' + newUser);
				done(null, newUser);
				});
			}
		});
	}
	)
	)

//WethinkCodeStrategy
passport.use(new WeThinkCodeStrategy({
	callbackURL: 'http://localhost:3002/auth/wethinkcode_login/redirect',
    clientID: keys.wethinkcode_login.clientID,
    clientSecret: keys.wethinkcode_login.clientSecret
  }, (accessToken, refreshToken,profile,done) => {
	//passport callback function
		User.findOne({wethinkcodeId: profile.id}).then((currentUser) => {
			if(currentUser){
				//if we already have this user
				console.log('user is:' + currentUser);
				done(null, currentUser);
			}
			else
			{
				new User({
				username: profile.login,
				wethinkcodeId: profile.id
				}).save().then((newUser) => {
				console.log('new user created: ' + newUser);
				done(null, newUser);
				});
			}
		});
	}
	)
	)

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect('/');
   //res.render('login');
  });
 

module.exports = router;