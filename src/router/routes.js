var passport    = require('passport');
var config      = require('./../config/config');
var authControllers = require('./../controller/auth-controllers.js');
var express     = require('express');
var lodash      = require('lodash');
var winston     = require('winston');
var app = module.exports = express.Router();

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  // For Google Authentication
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(new GoogleStrategy({
    clientID: config.GGAPI.clientID,
    clientSecret: config.GGAPI.clientSecret,
    callbackURL: config.GGAPI.callbackURL
}, function(accessToken, refreshToken, profile, done) {
        var user = {};
        user.userid = profile.id;
        user.usertype = 'Google Plus';
        var photo = profile.photos[0].value;
        if(photo && photo.indexOf('?sz=')){
            photo = photo.split('?sz=')[0]+'?sz=100';
        }
        user.avatar = photo;
        user.fullname = profile.displayName;
        user.email = profile.emails[0].value;
        return done(null, user);
    }
));

app.get('/auth/google', 
function(req,res){
    passport.authenticate('google', { 
                                        scope: ['https://www.googleapis.com/auth/plus.login','https://www.googleapis.com/auth/userinfo.email'],
                                        state: req.query.re
                                    })(req,res);
}
);
app.get('/auth/google/callback', 
function(req,res){
    var successUrl = req.query.state;
    passport.authenticate('google', {
            successRedirect : '/login?re=' + successUrl,
            failureRedirect : '/auth/google'
    })(req,res);
}
);
// End - For Google Authentication


// For Facebook Authentication
var FacebookStrategy = require('passport-facebook').Strategy;
passport.use(new FacebookStrategy({
    clientID: config.FBAPI.appId,
    clientSecret: config.FBAPI.clientSecret,
    callbackURL: config.FBAPI.callbackURL,
    profileFields: ['id', 'displayName', 'name', 'email','picture.type(normal)']
  },
  function(accessToken, refreshToken, profile, done) {
        var user = {};
        user.userid = profile.id;
        user.usertype = 'Facebook';
        var photo = profile.photos[0].value;
        user.avatar = photo;
        user.fullname = profile.displayName;
        return done(null, user);
  }
));

app.get('/auth/facebook',
    function(req,res){
        passport.authenticate('facebook',{
                                        state:req.query.re    
                                        })(req,res);
    }
);
app.get('/auth/facebook/callback',
    function(req,res){
        var successUrl = req.query.state;
        passport.authenticate('facebook', { 
            successRedirect:  '/login?re=' + successUrl,
            failureRedirect: '/auth/facebook'
        })(req,res);    
    }
);
// End - For Facebook Authentication

app.get('/login', authControllers.login);
app.get('/logout', authControllers.logout);
app.get('/userinfo', isLoggedIn, authControllers.userInfo);



// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()){
        return next();
    }else{
        res.status(401).send('Authentication Failed');
    }
}
    