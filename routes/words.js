var express = require("express");
var router = express.Router();

var thesaurus = require("powerthesaurus-api");

/* GET home page. */
router.post("/", function(req, res, next) {
  //Retrieve parameters from body (assumes application/json)
  const { word, kind } = req.body;

  thesaurus(word, kind).then(
    data => {
      console.log(data);
      res.status(200).json({
        data
      });
    },
    error => {
      throw error;
    }
  );

});

module.exports = router;
