
// Import dependencies
const cookieParser = require('cookie-parser');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const { json, urlencoded } = express;
const session = require('express-session')
const passport = require('passport')




const setGlobalMiddlewares = (app) =>{ 
  // Use cookie-parser middleware
  app.use(cookieParser());

  // Use morgan middleware for logging HTTP requests
  app.use(morgan('dev'));

  // Use method-override middleware
  app.use(methodOverride('_method'));

  // Use the JSON and form data parsers as middleware
  app.use(json());
  app.use(urlencoded({ extended: false }));

  // Set static folder
  app.use(express.static('public'));
  
  // Set Express-session
  app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
  }));

  // Set Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Instead of having to pass req.user every time 
  // We render a template, let’s take advantage of Express’ res.locals 
  app.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
  });
  
  
};

module.exports = {
  setGlobalMiddlewares,
};
