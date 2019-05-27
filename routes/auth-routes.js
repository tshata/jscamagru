var router = require('express').Router();
var passport = require('passport');
var User = require('../models/user');

var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth20');
var WeThinkCodeStrategy = require('passport-42').Strategy;
var User = require('../models/user');
const keys = require('../config/keys');


// auth with google
router.get('/google',passport.authenticate('google', {
	scope:['profile']
}));

// auth with wethinkcode
router.get('/wethinkcode_login',passport.authenticate('42', {
	scope:[]
}));

router.get('/wethinkcode_login/redirect', passport.authenticate('42'), (req,res) => {
	//res.send(req.user);
	res.redirect('/');
});



//callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req,res) => {
	//res.send(req.user);
	res.redirect('/');
});

module.exports = router;


