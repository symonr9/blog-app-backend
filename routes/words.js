/***********************************************************************
 * File Name: words.js
 * Description: Implements the words router. This uses an API to pull 
 * rhymes, synonyms, etc. Assumes that .env file or serverside config
 * variables are delcared for RAPIDAPIKEY.
 * Author: Symon Ramos symonr12@gmail.com
 **********************************************************************/

var express = require("express");
const fetch = require("node-fetch");
var router = express.Router();


const RAPIDAPIKEY = process.env.RAPIDAPIKEY;

/**********************************************************************
 * URI: Use an API to retrieve relevant words-related data.
 * Notes: Available uses of kind include: rhymes, definitions,
 * synonyms, antonyms, pronunciation, and examples. 
 **********************************************************************/
router.post("/", async (req, res, next) => {
  //Retrieve parameters from body (assumes application/json)
  const { word, kind } = req.body;

  let endpoint = word + "/" + kind;
  const response = await fetch("https://wordsapiv1.p.rapidapi.com/words/" + endpoint, {
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
      "x-rapidapi-key": RAPIDAPIKEY
    }
  });

  const data = await response.json();
  res.status(200).json(data);
});


/**********************************************************************
 * URI: Use an API to retrieve random words.
 * Notes: None
 **********************************************************************/
router.post("/random", async (req, res, next) => {
  const response = await fetch("https://wordsapiv1.p.rapidapi.com/words/?random=true", {
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
      "x-rapidapi-key": RAPIDAPIKEY
    }
  });

  const data = await response.json();
  res.status(200).json(data);
});

module.exports = router;
