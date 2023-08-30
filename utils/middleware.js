
// Import dependencies
const cookieParser = require('cookie-parser');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const { json, urlencoded } = express;

const setGlobalMiddlewares = (app) => {
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
};

module.exports = {
  setGlobalMiddlewares,
};
