const express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
const mustacheExpress = require('mustache-express');
const moment = require('moment');
const foods = require('./food');
const fs = require('fs');
const app = express();

// Set app to use bodyParser() middleware.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//'expressValidator' must come after 'bodyParser', since data must be parsed first!
app.use(expressValidator());

// tell express to use mustache
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

// tell express how to serve static files
app.use(express.static('public'));

// configure the / path
app.get('/', function(req, res) {
  res.render('home', {
    formattedDate: moment().format('dddd, MMMM Do YYYY, h:mm:ss a'),
    foods: foods
  });
});

// show a particular food
app.get('/food/:id', function(req, res) {
  res.render('food', {
    foodItem: foods[req.params.id]
  });
});

// show the form for creating a new food item
app.get('/foodForm', function(req, res) {
  res.render('foodForm');
});

// create a new food item when a form is posted
app.post('/createFood', function(req, res) {
  // check that the name is valid
  req.checkBody('name', 'You must enter a name for your food!').notEmpty();

  // check for errors
  var errors = req.validationErrors();

  if (errors) {
    // Render validation error messages
    var html = errors;
    res.send(html);
  } else {
    var name = req.body.name;
    res.send('you created ' + name);
  }
});

// make express listen on port 3000
app.listen(3000);
