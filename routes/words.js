/***********************************************************************
 * File Name: words.js
 * Description: Implements the words router. This uses an API to pull 
 * rhymes, synonyms, etc. 
 * Author: Symon Ramos symonr12@gmail.com
 **********************************************************************/

var express = require("express");
var router = express.Router();

var thesaurus = require("powerthesaurus-api");


/**********************************************************************
 * URI: Use an API to retrieve relevant words-related data.
 * Notes: None
 **********************************************************************/
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
