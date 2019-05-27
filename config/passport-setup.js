var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth20');
var WeThinkCodeStrategy = require('passport-42').Strategy;
var User = require('../models/user');

const keys = require('./keys');
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
		callbackURL:'http://localhost:3000/auth/google/redirect',
		clientID:keys.google.clientID,
		clientSecret:keys.google.clientSecret 
	}, (accessToken, refreshToken,profile,done) => {
	//passport callback function
		console.log("passport callback function");
		console.log(profile);
	})
)

//WethinkCodeStrategy
passport.use(new WeThinkCodeStrategy({
    clientID: keys.wethinkcode_login.clientID,
    clientSecret: keys.wethinkcode_login.clientSecret,
    callbackURL: 'http://localhost:3000/auth/wethinkcode_login/redirect'
  },
  function(accessToken, refreshToken, profile, cb) {
  	console.log("passport callback function");
		console.log(profile);
    User.findOrCreate({ fortytwoId: profile.id }, function (err, user) {
      
      return cb(err, user);
  	
    });
  }
));
