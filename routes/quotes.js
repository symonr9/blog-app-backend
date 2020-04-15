/***********************************************************************
 * File Name: quotes.js
 * Description: Implements the quotes router.
 * Author: Symon Ramos symonr12@gmail.com
 **********************************************************************/

var express = require("express");
const { check, validationResult } = require("express-validator");
const { generateCombination } = require("gfycat-style-urls");

var router = express.Router();

const Quote = require("../model/Quote");


/**********************************************************************
 * URI: Get All Quotes
 * Notes: None
 **********************************************************************/
router.get("/", async (req, res) => {
  Quote.find()
    .then(quotes => {
      res.status(200).json(quotes);
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

/**********************************************************************
 * URI: Get Quote by urlId
 * Notes: None
 **********************************************************************/
router.get("/:urlId", (req, res, next) => {
  Quote.findOne({
    urlId: req.params.urlId
  })
    .then(quote => {
      res.status(200).json(quote);
    })
    .catch(error => {
      res.status(404).json({
        error: error
      });
    });
});

/**********************************************************************
 * URI: Create Quote
 * Notes: None
 **********************************************************************/
router.post(
  "/create",
  [
    //Validates input.
    check("text", "Please Enter a Valid Text")
      .not()
      .isEmpty(),
    check("author", "Please Enter a Valid Author")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    //Check for errors based on what was passed in
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    //Retrieve parameters from body (assumes application/json)
    const { text, author, isPublic, dateGiven, createdBy } = req.body;
    const urlId = `${generateCombination(2, "-")}`.toLowerCase();

    let quote = new Quote({
      urlId,
      text,
      author,
      isPublic,
      dateGiven,
      createdBy
    });

    quote
      .save()
      .then(
        res.status(200).json({
          quote
        })
      )
      .catch(error => {
        res.status(400).json({
          error: error
        });
      });
  }
);


/**********************************************************************
 * URI: Edit Quote
 * Notes: Expects _id, not urlId. Because it is being called on an
 * existing item, _id is used instead of urlId because it is known.
 **********************************************************************/
router.put("/edit/:id", async (req, res, next) => {

  //Retrieve parameters from body (assumes application/json)
  const { text, author, isPublic } = req.body;
  //Fixme: Add dateGiven at some point
  const _id = req.params.id;

  let urlId = "";
  try{
    let existingQuote = await Quote.findOne({
      _id
    });

    urlId = existingQuote.urlId;
  }
  catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Server Error"
    });
  }

  //Fixme: pull createdBy from active user
  const createdBy = "admin";

  const quote = new Quote({
    _id,
    urlId,
    text,
    author,
    isPublic,
    //date given would be added here
    createdBy
  });

  Quote.updateOne({ _id: req.params.id }, quote)
    .then(() => {
      res.status(201).json({
        message: "Quote updated successfully!"
      });
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

/**********************************************************************
 * URI: Delete Quote
 * Notes: Expects _id, not urlId. Because it is being called on an
 * existing item, _id is used instead of urlId because it is known.
 **********************************************************************/
router.delete("/delete/:id", (req, res, next) => {
  Quote.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({
        message: "Deleted!"
      });
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

module.exports = router;
