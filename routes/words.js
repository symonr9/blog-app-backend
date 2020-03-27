var express = require("express");
var router = express.Router();

var thesaurus = require("powerthesaurus-api");

/* GET home page. */
router.get("/", function(req, res, next) {
  //Retrieve parameters from body (assumes application/json)
  const { word, kind } = req.body;

  /*
  // Callbacks:
  thesaurus("car", function(err, res) {
    if (err) throw err;
    console.log(res);
  });
  */

  // Promises and given a kind:
  thesaurus(word, kind).then(
    result => {
      console.log(result);
      res.status(200).json({
        result
      });
    },
    error => {
      throw error;
    }
  );

});

module.exports = router;
