var express = require('express');
var router = express.Router();

var thesaurus = require("powerthesaurus-api");

/* GET home page. */
router.get('/', function(req, res, next) {

  // Callbacks:
thesaurus('car', function(err, res) {
  if (err) throw err
  console.log(res)
})

  res.render('index', { title: 'Express' });
});

module.exports = router;
