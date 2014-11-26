var express = require('express');
var router = express.Router();
var models = require('../models');
/* GET home page. */

router.get('/', function(req, res) {
  models.Hotel.find(function(err, results) {
    res.render('index', { hotels: results, title: "Trip Planner" });
  });
});
module.exports = router;
